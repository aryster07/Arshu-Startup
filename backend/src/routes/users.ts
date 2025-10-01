import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ message: 'Users routes - Coming soon' }));
export default router;