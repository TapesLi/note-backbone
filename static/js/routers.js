App.Routers.NoteRouter = Backbone.Router.extend({
    $el : $('#main div.container'),
    routes : {
        "" : "index",
        "note" : "notes_list",
        "note/:id" : "note_detail",
        "new" : "note_create",
    },

    initialize : function() {
        this.notes_list = new App.Collections.NotesList();
    },

    index : function() {

    },

    notes_list : function() {
        var notes_list_view = new App.Views.NotesListView({
            collection : this.notes_list,
        });
        this.$el.html(notes_list_view.render().el);
    },

    note_create : function() {
        var note_edit_view = new App.Views.NoteEditView({
            collection : this.notes_list,
        });
        this.$el.html(note_edit_view.render().el);
    },

    note_detail : function(id) {
        var note = this.notes_list.get(id);
        var note_detail_view = new App.Views.NoteDetailView({
            model : note,
        });
        this.$el.html(note_detail_view.render().el);
    }
});
