import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import User from "../model/User.js"
import UserLoginFailAttampts from "../model/UserLoginFailAttampts.js"

export const register = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    res.status(404).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({"message":"User not found"});
    if (user.is_locked) return res.status(404).json({"message":"fail! User was locked"});
    
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
    {
      let attamp = await UserLoginFailAttampts.findOne({ username: req.body.username });
      if(!attamp){
        const NewLoginAttamp = new UserLoginFailAttampts({
          username:req.body.username,
          login_fail_timestamp:Date.now(),
          login_fail_count:1
        });
        await NewLoginAttamp.save();
      }
      else{
        const timeDifferece = Date.now() - attamp.login_fail_timestamp;
        if(timeDifferece <= 300000)
        {
          let attamps = attamp.login_fail_count+1
          const updateLoginAttamp = await UserLoginFailAttampts.findOneAndUpdate(
            { username: attamp.username },{login_fail_count:attamps},
            );
          if(attamps>3)
          {
            const lockUser = await User.findOneAndUpdate(
              { username: attamp.username },{is_locked:true},
              );
          }
        }
        else{
          const query = { username: attamp.username };
          const updateLoginAttamp = await UserLoginFailAttampts.findOneAndUpdate(
            query,{login_fail_timestamp:Date.now(),login_fail_count:1},
            );
        }
      } 
      return res.status(404).json({"message":"fail! username and password are not matched"});
    }
    else
    {
      let attamp = await UserLoginFailAttampts.findOne({ username: req.body.username });
      const lockUser = await User.findOneAndUpdate(
        { username: req.body.username },{is_locked:false},
      );
      const updateLoginAttamp = await UserLoginFailAttampts.findOneAndDelete(
        { username: req.body.username }
      );
    }
    
    const token = jwt.sign({ id: user._id},'jwtkey');

    res.cookie("access_token", token, { httpOnly: true, }).status(200).json({"message":"success!", "jwt_token": token});
  } catch (err) {
    res.status(404).json(err);
  }
};

export const reset = async (req, res) => {
  try {
      const lockUser = await User.findOneAndUpdate(
        { username: req.body.username },{is_locked:false},
      );
      const updateLoginAttamp = await UserLoginFailAttampts.findOneAndDelete(
        { username: req.body.username}
      );

    res.status(200).json({"message":"reset success!"});
  } catch (err) {
    res.status(404).json(err);
  }
};