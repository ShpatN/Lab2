export interface CreatePaymentIntentBody {
  amountCents: number;
  currency?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

export interface CreatePaymentDTO {
  userId: number;
  reservationId?: number | null;
  amount: number;
}
