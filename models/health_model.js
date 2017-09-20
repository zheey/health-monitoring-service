var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WorkerSchema = new Schema({
   morning:Number,
   afternoon:Number
}, {_id:false});
mongoose.model('Worker', WorkerSchema);

var ReportSchema = new Schema({
    dayschedule: Number,
    vaccinated: [WorkerSchema],
    availableworkers:[WorkerSchema],
    achievement:String,
    challenges:String,
    impact: String,
    imagefile: String
}, {_id:false});
mongoose.model('Report', ReportSchema);

var WorkSchema = new Schema({
    workday: String,
    report:[ReportSchema]
});
mongoose.model('Work', WorkSchema);

var UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    privilege: String
});
mongoose.model('User', UserSchema);
