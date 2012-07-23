App.Collections.NotesList = Backbone.Collection.extend({
    model : App.Models.Note,
    localStorage : store,
}); 