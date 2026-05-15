import { useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { toast } from "sonner";
import { apiUrl, createPaymentIntent, createPaymentRecord } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Props = {
  reservationId: number;
  amountCents: number;
  onPaid: () => void;
};

const InnerCheckout = ({
  reservationId,
  amountCents,
  onPaid,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");

  const amount = (amountCents / 100).toFixed(2);

  const handlePay = async () => {
    if (!stripe || !elements || !user) return;
    setIsPaying(true);
    setError("");
    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed.");
        return;
      }

      await createPaymentRecord({
        userId: user.id,
        reservationId,
        amount: Number(amount),
      });
      toast.success("Payment completed successfully.");
      onPaid();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record payment.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="glass rounded-xl p-5 space-y-4">
      <h3 className="font-display font-bold text-lg text-foreground">Complete payment</h3>
      <p className="text-sm text-muted-foreground">Reservation #{reservationId} - EUR {amount}</p>
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || !elements || isPaying}
        className="gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isPaying ? "Processing..." : "Pay now"}
      </button>
    </div>
  );
};

const ReservationCheckout = ({ reservationId, amountCents, onPaid }: Props) => {
  const envPk = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim() ?? "";
  const [publishableKey, setPublishableKey] = useState(envPk);
  const [publishableKeyResolved, setPublishableKeyResolved] = useState(!!envPk);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (envPk) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl("/api/stripe/publishable-key"));
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { publishableKey?: string };
        const k = data.publishableKey?.trim() ?? "";
        if (!cancelled) setPublishableKey(k);
      } catch {
        if (!cancelled) setPublishableKey("");
      } finally {
        if (!cancelled) setPublishableKeyResolved(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [envPk]);

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await createPaymentIntent({ amountCents, currency: "eur" });
        if (!cancelled) setClientSecret(res.clientSecret);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not start payment.");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [amountCents]);

  if (!publishableKeyResolved) {
    return <p className="text-sm text-muted-foreground">Loading payment configuration…</p>;
  }

  if (!publishableKey || !stripePromise) {
    return (
      <p className="text-sm text-amber-400">
        Stripe publishable key is missing. Set <code className="text-xs">VITE_STRIPE_PUBLISHABLE_KEY</code> in{" "}
        <code className="text-xs">frontend/.env</code> or <code className="text-xs">Stripe:PublishableKey</code> in
        backend configuration.
      </p>
    );
  }

  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!clientSecret) return <p className="text-sm text-muted-foreground">Preparing secure checkout...</p>;

  const options: StripeElementsOptions = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerCheckout reservationId={reservationId} amountCents={amountCents} onPaid={onPaid} />
    </Elements>
  );
};

export default ReservationCheckout;
