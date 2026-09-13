export function getHealth(request, response) {
  response.json({
    success: true,
    service: "pos-backend",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
