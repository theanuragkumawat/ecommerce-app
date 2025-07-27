const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async ({ req, res }) => {
    try {
        const { cartItems, totalAmount, userId } = JSON.parse(req.body);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: cartItems.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: { name: 'Red Tshirt' },
                    unit_amount: Math.round(item.price),
                },
                quantity: item.quantity,
            })),
            success_url: "http://localhost:5173/",
            cancel_url: "http://localhost:5173/verify",
            metadata: {
                userId:userId,
                totalAmount:totalAmount,
            },
        });

        return res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe error", error.message);
        return res.json({ error: "Stripe session failed" });
    }
};
