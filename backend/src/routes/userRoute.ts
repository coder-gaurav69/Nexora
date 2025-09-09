// import express, { Request, Response } from "express";
// import userModel from "../mongoose/Schemas/userSchema.js";

// const userRoute = express.Router();

// const userDetails = async (req: Request, res: Response) => {
//   try {
//     const customerId = req.query.customerId as string | undefined;

//     let users:string[];

//     // If customerId is present
//     if (customerId) {
//       // Validate format
//       if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
//         return res.status(400).json({
//           message: "Invalid customerId format",
//           success: false,
//         });
//       }

//       const user:string = await userModel.findById(customerId);
//       if (!user) {
//         return res.status(404).json({
//           message: "Customer not found",
//           success: false,
//         });
//       }

//       users = [user]; // Return as array for consistent format
//     } else {
//       // No filter: return all users
//       users = await userModel.find();
//     }

//     return res.status(200).json({
//       message: customerId ? "User fetched successfully" : "All users fetched successfully",
//       success: true,
//       data: users,
//     });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//       error: error instanceof Error ? error.message : String(error),
//     });
//   }
// };

// // GET /api/userDetails 
// userRoute.get("/userDetails", userDetails);


    
    
    



// export default userRoute;