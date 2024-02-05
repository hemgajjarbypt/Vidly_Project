const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground').then(() => console.log('Connected to MongoDB...')).catch((err) => console.log('could not connect to mongodb', err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);


async function createCourse() {
    const course = new Course({
        name: 'Hello Course',
        author: 'Hem',
        tags: ['python', 'full-stack'],
        isPublished: false
    });
    const result = await course.save();
    console.log(result);
}

createCourse();

async function getCourse(){
    const courses = await Course.find().limit(3).sort({ name: 1 }).select({name:1, author:1, tags:1, _id: 0});
    console.log(courses);
}

// getCourse();


async function updateCourse(id){
    const result = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Hem',
            isPublished: false
        }
    }, { new: true });
    console.log(result);
}

// updateCourse('5a68fdd7bee8ea64649c2777');

async function removeCourse(id){
    // const result = await Course.deleteOne( { _id:id });
    const course = await Course.findByIdAndDelete(id);
    console.log(course);
}

// removeCourse('5a68fdf95db93f6477053ddd');
