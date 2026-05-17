import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/pwcommerce";
export const handleMongoDbConnection = async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("mongoDbConnection Successfull");
	} catch (error) {
		console.log("error==>handleMongoDbConnection", error);
	}
};
