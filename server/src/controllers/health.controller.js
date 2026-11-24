import * as healthService from "../services/health.service.js";

export function getHealth(req, res) {
  res.json(healthService.getStatus());
}
