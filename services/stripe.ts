import Stripe from 'stripe';

const STRIPE_TOKEN = process.env.STRIPE_TOKEN as string;

const stripe = new Stripe(STRIPE_TOKEN);

export default stripe;
