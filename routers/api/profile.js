import { Router } from "express";
import { check, validationResult } from 'express-validator';
import authr from '../../middleware/authr.js';
import User from '../../models/Users.js';
import Profile from '../../models/Profile.js';

const profile = Router();


/**
 * @route GET /api/profile/me
 * @desc Get current users profile
 * @access Public
 */

profile.get('/me',authr, async (req, res) => {
    try {
        const myprofile = await Profile.findOne({user:req.user.id})
        .populate('user',['name','avatar']);
        if(!myprofile) {
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(myprofile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});
/**
 * @route Post /api/profile
 * @desc Create or update user profile
 * @access private
 */

profile.post('/',[authr,
    [
    check('status').notEmpty().withMessage('satus is required'),
    check('skills').notEmpty().withMessage('skills is required')
     
 ]
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()})

    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    //if (handle) profileFields.handle = req.body.handle;
    if (company) profileFields.company = req.body.company;
    if (website) profileFields.website = req.body.website;
    if (location) profileFields.location = req.body.location;
    if (bio) profileFields.bio = req.body.bio;
    if (status) profileFields.status = req.body.status;
    if (githubusername) profileFields.githubusername = req.body.githubusername;
    if(skills) {
        profileFields.skills=skills.split(',').map(skill => skill.trim())
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    
    try {
        let profile1 = await Profile.findOne({user: req.user.id});
        
        if(profile1) {
            //update
           
            profile1 = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new: true}
            );
            return res.json(profile1);
        }
        //create
        profile1 = new Profile(profileFields);
        console.log(profile1);
        await profile1.save();
        return res.json(profile1);

    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
    
});

/**
 * @route Get /api/profile
 * @desc Get all profiles
 * @access public
 */
profile.get("/",async (req,res) =>{
    try{
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('server error')  
    }
})
export default profile;