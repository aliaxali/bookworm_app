import express from "express"
import Book from "../models/Book.js"
import cloudinary from "../lib/cloudinary.js"
import protectRoute from "../middleware/auth.middleware.js"
const router=express.Router()

//create book
router.post("/",protectRoute,async (req,res) => {
    try {
        const {title,caption,image,rating}=req.body
        if (!title ||!caption || !image || !rating)
            return res.status(400).json({message:"All fields are required"})

        //upload image to cloudinary
        const uploadResponse=await cloudinary.uploader.upload(image)
        const imageurl=uploadResponse.secure_url

        //save to db
        const newBook=new Book({
            title,
            caption,
            rating,
            image:imageurl,
            user:req.user._id
        })
        await newBook.save()
        res.status(201).json(newBook)


    } catch (error) {
        console.log("error in creating book",error);
        res.status(500).json({ message: error.message})
        
    }
})


//pagination:infinite loading ie loading as scrolls fetch first 5 , then next 5(not 1000 post all at once)
router.get("/",protectRoute,async (req,res) =>{
    //example call from react native -frontend
    //const response =await fetch("http://localhost:3000/api/books?page=3&limit=5")
    try {
        const page=req.query.page || 1
        const limit=req.query.limit ||2
        const skip=(page-1)*limit


        const books= await Book.find()
        .sort({createdAt:-1}) //descending :latest post first
        .skip(skip)
        .limit(limit)
        .populate("user","username profileImage");

        const totalBooks=await Book.countDocuments();

        res.send({
            books,
            currentPage:page,
            totalBooks,
            totalPages:Math.ceil(totalBooks/limit)
        })
    } catch (error) {
        console.log("Error in get all book route",error);
        return res.status(500).json({message:"internal Server Error"})
    }
})

// get recommened books by logged in user
router.get("/user",protectRoute,async (req,res) =>{
    try {
        const books =await Book.find({user:req.user._id}).sort({createdAt:-1});
        res.json(books)
    } catch (error) {
        console.error("Get user books error: ",error.message)
        res.status(500).json({message:"Server error"})        
    }
   
})

router.delete("/:id",protectRoute,async (req,res) =>{
    try {
        const book=await Book.findById(req.params.id)
        if (!book)
            return res.status(400).json({message:"Book not found"})

        //check if user is the creator of the book 
        if(book.user.toString() !== req.user._id.toString())
            return res.status(401).json({message:"unauthorized"})

        //delete image from cloudinary as well
        if(book.image && book.image.includes("cloudinary")){ //image is saved as http://res.cloudinary.com/..  which contain "cloudinary"
            try {
                const publicId =book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId)
            } catch (deleteError) {
                console.log("Error deleting image from cloudinary",deleteError);

                
            }

        }

        await book.deleteOne()
    } catch (error) {
        console.log();
        
    }

})

export default router
