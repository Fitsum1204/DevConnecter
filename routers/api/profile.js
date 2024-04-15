import { Router } from "express";
import { check, validationResult } from 'express-validator';
import authr from "../../middleware/authr.js";
import User from '../../models/Users.js';
import Profile from '../../models/Profile.js';
import Post from '../../models/Post.js';
import config from 'config';
import request from 'request';
import axios from 'axios';

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
            ).populate('user',['name','avatar']);
            return res.json(profile1);
        }
        //create
        
        profile1 = new Profile(profileFields);
        await profile1.populate('user',['name','avatar']);
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

/**
 * @route Get /api/profile/user/:user_id
 * @desc Get profile by user Id
 * @access public
 */

profile.get("/user/:user_id",async (req,res) =>{
    try{
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'profile not found'});
        
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({msg:'profile not found'});
        }
        res.status(500).send('server error')  
    }
})


// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
profile.delete('/', authr, async (req, res) => {
    try {
      // Remove user posts
      
      await Post.deleteMany({user: req.user.id }).then();
      // Remove profile
      
      await Profile.findOneAndDelete({ user: req.user.id }).then();
      // Remove user
      await User.findOneAndDelete({ _id: req.user.id });
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  // @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
profile.put(
    '/experience',
    [authr,    
    [   check('title').notEmpty().withMessage('title is required'),
        check('company').notEmpty().withMessage('company is required'),       
        check('from').notEmpty().withMessage('From date is required and needs to be from the past')
    
      ]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  // @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

profile.delete('/experience/:exp_id', authr, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
        //Get remove index
        const removeIndex = profile.experience.map(item =>item.id).indexOf
        (req.params.exp_id);
      
    
  profile.experience.splice(removeIndex ,1);
      await profile.save();
       res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
profile.put(
    '/education',
    [authr,    
    [   check('school').notEmpty().withMessage('title is required'),
        check('degree').notEmpty().withMessage('Degree is required'),       
        check('fieldofstudy').notEmpty().withMessage('Field of study  is required '),
        check('from').notEmpty().withMessage('From date is required')
    
      ]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  // @route    DELETE api/profile/education/:exp_id
// @desc     Delete education from profile
// @access   Private

profile.delete('/education/:exp_id', authr, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
        //Get remove index
        const removeIndex = profile.education.map(item =>item.id).indexOf
        (req.params.edu_id);
      
    
  profile.education.splice(removeIndex ,1);
      await profile.save();
       res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

   // @route    GET api/profile/github/username
// @desc     Get users Repo from Github
// @access   Public

/*profile.get('/github/username',async (req,res) => {
    try {
        const options = {
            url:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=
            created:asc@client_id=${config.get('githubClientId')}&client_secret=
            ${config.get('githubSecret')}`,
            method:'GET',
            headers: {'user-agent' :'node.js'}
        };
        request(options, (err ,response,body)=> {
            if(err) console.error(err);
            if(response.statusCode !== 200) {
                return res.status(404).json({msg:'No Github profile found'})
            }
            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
        
    }
} );*/
profile.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubClientId')}`
      };
  console.log("hello")
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });

export default profile;