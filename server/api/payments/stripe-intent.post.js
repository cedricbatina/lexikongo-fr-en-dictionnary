// server/api/payments/stripe-intent.post.js
import { defineEventHandler, readBody, createError } from "h3";
import { useRuntimeConfig } from "#imports";
import Stripe from "stripe";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const secretKey = config.stripeSecretKey || process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Stripe n’est pas configuré côté serveur (STRIPE_SECRET_KEY manquant).",
    });
  }

  const stripe = new Stripe(secretKey);

  const body = await readBody(event);
  const rawAmount = Number(body?.amount);

  if (!rawAmount || Number.isNaN(rawAmount) || rawAmount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Montant invalide.",
    });
  }

  // euros -> centimes
  const amountCents = Math.round(rawAmount * 100);

  if (amountCents < 100 || amountCents > 1000000) {
    // 1 € à 10 000 €
    throw createError({
      statusCode: 400,
      statusMessage: "Montant hors plage autorisée.",
    });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        origin: "lexikongo-contribute",
      },
    });

    return {
      clientSecret: intent.client_secret,
    };
  } catch (err) {
    console.error("Stripe PaymentIntent error :", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la création du paiement.",
    });
  }
});
