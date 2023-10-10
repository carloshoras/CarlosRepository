function sendEmail(from, to, message) {};

class Tutoring {
    constructor() {
        this.list_students = [];
        this.list_teachers = [];
    };
    getStudentByName(name, surname) {
        for (let student of this.list_students) {
            if (student["name"] == name && student["surname"] == surname) {
                return student;
            };
        };
    };
    getTeacherByName(name, surname) {
        for (let teacher of this.list_teachers) {
            if (teacher["name"] == name && teacher["surname"] == surname) {
                return teacher;
            };
        };
    };
    getStudentsForTeacher(teacher) {
        let listMatches = [];
        for (let student of this.list_students) {
            if (ExtendedUser.match(teacher,student) != undefined) {
                listMatches.push(student);
            };
        };
        return listMatches;
    };
    getTeacherForStudent(student) {
        let listMatches = [];
        for (let teacher of this.list_teachers) {
            let haymatch = ExtendedUser.match(teacher,student); 
            if (haymatch != undefined && haymatch.length != 0) {
                listMatches.push(teacher);
            };
        };
        return listMatches;
    };
    addStudent(name, surname, email) {
        this.list_students.push(new Student({name: name, surname: surname, email: email}));
    };
    addTeacher(name, surname, email) {
        this.list_teachers.push(new Teacher({name: name, surname: surname, email: email}));
    };
};

class ExtendedTutoring extends Tutoring {
    sendMessages(from, to, message) {
        for (let recipient of to) {
            recipient.sendMessage(from, message);
        };
    };
};

class User {
    constructor({name, surname, email, role}) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.role = role;
        this.courses = {};
        this.messages = [];
    };
    addCourse(course, level) {
        this.courses[course] = level;
    };
    removeCourse(course) {
        delete this.courses[course];
    };
    editCourse(course, level) {
        this.courses[course] = level;
    };
    sendMessage(from, message) {
        sendEmail(from, this.name, message);
        this.messages.push([from.email, this.email, message]);
    };
    showMessagesHistory() {
        for (let coso of this.messages) {
            console.log(`${coso[0]} -> ${coso[1]}: ${coso[2]}`);
        };
    };
};

class ExtendedUser extends User {
    constructor({name, surname, email, role}) {
        super({name, surname, email, role});
    };
    set fullName(Name) {
        let fullname = Name.split(" ");
        this.name = fullname[0];
        this.surname = fullname[1];
    };
    get fullName() {
        return this.name + " " + this.surname;
    };
    static match(teacher,student,course) {
        let listaMatch = [];
        if (course != undefined) {
            if (student.courses[course]!=undefined && teacher.courses[course]!=undefined){
                return {course: course, level: teacher.courses[course]}
            } else {
                return undefined;
            };
        };
        for (let curso of Object.keys(teacher.courses)) {
            if (student.courses[curso] != undefined) {
                if (teacher.courses[curso]>=student.courses[curso]) {
                    listaMatch.push({course: curso, level: teacher.courses[curso]});
                };
            };
        };
        return listaMatch;
    };
};

class Teacher extends ExtendedUser {
    constructor({name, surname, email}) {
        let role = "teacher";
        super({name, surname, email, role});
    };
};

class Student extends ExtendedUser {
    constructor({name, surname, email}) {
        let role = "student";
        super({name, surname, email, role});
    };
};

let tutoring = new ExtendedTutoring();
tutoring.addStudent('Rafael', 'Fife','rfife@rhyta.com');
tutoring.addStudent('Kelly', 'Estes', 'k_estes@dayrep.com');
tutoring.addTeacher('Paula', 'Thompkins', 'PaulaThompkins@jourrapide.com');
let to = [];
to.push(tutoring.getStudentByName('Rafael', 'Fife'));
to.push(tutoring.getStudentByName('Kelly', 'Estes'));
tutoring.sendMessages(tutoring.getTeacherByName('Paula', 'Thompkins'), to, 'test message');
for(let user of to) {
    user.showMessagesHistory();
}
// -> PaulaThompkins@jourrapide.com -> rfife@rhyta.com: test message
// -> PaulaThompkins@jourrapide.com -> k_estes@dayrep.com: test message