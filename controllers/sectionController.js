const Sections = require('../models/section');

class sectionsController{
    // [GETALL] Section
    async APIGet(req,res,next){
        try{
            const sections = await Sections.find({})
            res.status(200).json({
                "status": "success",
                "message": 'Get Data Success',
                "data": sections
            })
        }catch(error){
            res.status(500).json({
                "status": "Error",
                "message": "Internet Server Error",
                "Description": error.message
            })
        }
    }
};

module.exports = new sectionsController;