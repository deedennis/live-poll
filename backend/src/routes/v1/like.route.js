import express from "express";
import { verifyToken } from "../../middlwares/verifyToken.js";
import { createLikeController, removeLikeController, getUserLikesController, getPollLikesController } from "../../controllers/like.controller.js";

const likeRouter = express.Router();

/**
 * @swagger
 * /like/{pollId}:
 *   post:
 *     summary: Like a poll
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         schema:
 *           type: string
 *         required: true
 *         description: Poll ID
 *     responses:
 *       201:
 *         description: Poll liked successfully
 *       400:
 *         description: Already liked this poll
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
likeRouter.post("/:pollId", verifyToken, (req, res, next) => {
  req.io = req.app.get('io');
  next();
}, createLikeController);

/**
 * @swagger
 * /like/{pollId}:
 *   delete:
 *     summary: Remove like from a poll
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         schema:
 *           type: string
 *         required: true
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       400:
 *         description: Poll not liked yet
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
likeRouter.delete("/:pollId", verifyToken, (req, res, next) => {
  req.io = req.app.get('io');
  next();
}, removeLikeController);

/**
 * @swagger
 * /like/user:
 *   get:
 *     summary: Get user's liked polls
 *     tags: [Like]
 *     responses:
 *       200:
 *         description: User likes fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
likeRouter.get("/user", verifyToken, getUserLikesController);

/**
 * @swagger
 * /like/poll/{pollId}:
 *   get:
 *     summary: Get poll likes
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         schema:
 *           type: string
 *         required: true
 *         description: Poll ID
 *     responses:
 *       200:
 *         description: Poll likes fetched successfully
 *       500:
 *         description: Internal server error
 */
likeRouter.get("/poll/:pollId", getPollLikesController);

export default likeRouter;
