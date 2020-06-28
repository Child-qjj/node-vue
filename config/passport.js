const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose=require('mongoose');
const User=mongoose.model("users");
const keys=require("../config/keys");

const opts = {}//有些配置不懂就不要写,不然出问题
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
module.exports=passport=>{
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      // console.log(jwt_payload);
      User.findById(jwt_payload.id)
          .then(user=>{
            if (user) {
              return done(null,user);
            }
            return done(null,false);
          })
          .catch(err=>console.log(err)
          )
      
    }));
}