Meteor.methods({
    'positions.test'() {
        console.log("I am here...");
    },
    'positions.insert'(text) {
        check(text, String);

        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Positions.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
        });
    },
    'psotions.remove'(positionId) {
        check(positionId, String);

        Positions.remove(positionId);
    },

    'positions.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        Positions.update(taskId, { $set: { checked: setChecked } });
    },
});