
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('PayPal capture', body.orderId)
  return { ok: true }
})
