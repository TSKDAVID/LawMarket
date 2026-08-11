import "server-only";
import { randomUUID } from "node:crypto";
import {
  ConsultationRequestSchema,
  OrderSchema,
  type ConsultationRequest,
  type Customer,
  type Locale,
  type Order,
  type PaymentStatus,
} from "@/schemas";

/**
 * OrderStore interface (ENGINEERING.md §2). The in-memory implementation is
 * the mock-stage stand-in; real persistence (Vercel KV / Postgres) replaces
 * only this implementation, never its callers.
 */

export interface CreateOrderInput {
  serviceId: string;
  priceGel: number;
  customer: Customer;
  locale: Locale;
  /** Client-generated key so a double submit returns the same order. */
  idempotencyKey: string;
}

export interface OrderStore {
  create(input: CreateOrderInput): Promise<Order>;
  get(id: string): Promise<Order | undefined>;
  /** Idempotent payment transition: a paid order never changes again. */
  applyPaymentResult(orderId: string, result: PaymentStatus): Promise<Order | undefined>;
}

export interface CreateConsultationInput {
  name: string;
  email: string;
  phone: string;
  matter?: string;
  locale: Locale;
  idempotencyKey: string;
}

export interface ConsultationStore {
  create(input: CreateConsultationInput): Promise<ConsultationRequest>;
  get(id: string): Promise<ConsultationRequest | undefined>;
}

/* ------------------------- In-memory implementation ------------------------- */

interface MemoryState {
  orders: Map<string, Order>;
  orderIdByIdempotencyKey: Map<string, string>;
  orderSequence: number;
  consultations: Map<string, ConsultationRequest>;
  consultationIdByIdempotencyKey: Map<string, string>;
  consultationSequence: number;
}

/** Survives dev-server module reloads within one process. */
const globalStore = globalThis as unknown as { __lawmarketStore?: MemoryState };

function state(): MemoryState {
  globalStore.__lawmarketStore ??= {
    orders: new Map(),
    orderIdByIdempotencyKey: new Map(),
    orderSequence: 0,
    consultations: new Map(),
    consultationIdByIdempotencyKey: new Map(),
    consultationSequence: 0,
  };
  return globalStore.__lawmarketStore;
}

function referenceFor(sequence: number, prefix: "LM" | "LMC"): string {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(sequence).padStart(5, "0")}`;
}

class InMemoryOrderStore implements OrderStore {
  async create(input: CreateOrderInput): Promise<Order> {
    const s = state();
    const existingId = s.orderIdByIdempotencyKey.get(input.idempotencyKey);
    if (existingId) {
      const existing = s.orders.get(existingId);
      if (existing) return existing;
    }
    s.orderSequence += 1;
    const now = new Date().toISOString();
    const order = OrderSchema.parse({
      id: randomUUID(),
      reference: referenceFor(s.orderSequence, "LM"),
      serviceId: input.serviceId,
      priceGel: input.priceGel,
      currency: "GEL",
      customer: input.customer,
      locale: input.locale,
      status: "received",
      payment: "pending",
      createdAt: now,
      updatedAt: now,
    });
    s.orders.set(order.id, order);
    s.orderIdByIdempotencyKey.set(input.idempotencyKey, order.id);
    return order;
  }

  async get(id: string): Promise<Order | undefined> {
    return state().orders.get(id);
  }

  async applyPaymentResult(orderId: string, result: PaymentStatus): Promise<Order | undefined> {
    const s = state();
    const order = s.orders.get(orderId);
    if (!order) return undefined;
    // Idempotent: once paid, repeat callbacks (webhook retries) are no-ops.
    if (order.payment === "paid") return order;
    if (order.payment === result) return order;
    const updated: Order = { ...order, payment: result, updatedAt: new Date().toISOString() };
    s.orders.set(orderId, updated);
    return updated;
  }
}

class InMemoryConsultationStore implements ConsultationStore {
  async create(input: CreateConsultationInput): Promise<ConsultationRequest> {
    const s = state();
    const existingId = s.consultationIdByIdempotencyKey.get(input.idempotencyKey);
    if (existingId) {
      const existing = s.consultations.get(existingId);
      if (existing) return existing;
    }
    s.consultationSequence += 1;
    const request = ConsultationRequestSchema.parse({
      id: randomUUID(),
      reference: referenceFor(s.consultationSequence, "LMC"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      matter: input.matter,
      locale: input.locale,
      status: "received",
      createdAt: new Date().toISOString(),
    });
    s.consultations.set(request.id, request);
    s.consultationIdByIdempotencyKey.set(input.idempotencyKey, request.id);
    return request;
  }

  async get(id: string): Promise<ConsultationRequest | undefined> {
    return state().consultations.get(id);
  }
}

export const orderStore: OrderStore = new InMemoryOrderStore();
export const consultationStore: ConsultationStore = new InMemoryConsultationStore();
