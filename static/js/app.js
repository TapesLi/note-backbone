var store = new Store('嘻嘻');

var tpl = {
    notes_list_tpl : Handlebars.compile($('#notes-list-tpl').html()),
    note_item_tpl : Handlebars.compile($('#note-item-tpl').html()),
    note_detail_tpl : Handlebars.compile($('#note-detail-tpl').html()),
    note_edit_tpl : Handlebars.compile($('#note-edit-tpl').html()),
};

var Note = Backbone.Model.extend({

    defaults : {
        title : 'Title',
        content : 'content',
    },

    localStorage : store,

    initialize : function() {
        // console.log(this.get('title'));
        // console.log(this.get('content'));
    },
});

var NotesList = Backbone.Collection.extend({

    model : Note,
    localStorage : store,
});

var NoteItemView = Backbone.View.extend({
    tagName : 'li',
    className : 'note-item',
    tpl : tpl.note_item_tpl,

    events : {
        'click button' : 'clear',
    },

    initialize : function() {
        this.model = this.options.model;
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
    },

    render : function() {
        this.$el.html(this.tpl(this.model.toJSON()));
        return this;
    },

    clear : function() {
        this.model.destroy();
    },
});

var NoteDetailView = Backbone.View.extend({
    id : 'note-detail',
    tpl : tpl.note_detail_tpl,
    initialize : function() {
        this.model = this.options.model;
    },
    render : function() {
        return this;
    }
});

var NoteEditView = Backbone.View.extend({
    // el : $('#note-edit'),
    tagName : 'div',
    id : '#note-edit',
    tpl : tpl.note_edit_tpl,

    events : {
        'click button[name="cancel"]' : 'cancel',
        'click button[name="save"]' : 'save',
        'click input' : 'select',
        'click textarea' : 'select',
    },

    initialize : function() {
        _.bindAll(this, 'render', 'cancel', 'save', 'select');
        this.collection = this.options.collection;
        // console.log(this.collection);
        this.model = this.options.models || (new this.options.collection.model());
        // B = this.collection;
        // this.model = {};
    },

    render : function() {
        this.$el.append(this.tpl(this.model.toJSON()));
        return this;
    },
    cancel : function(event) {
        event.preventDefault();
        this.$el.remove();
        // this.undelegateEvents();
    },
    save : function(event) {
        event.preventDefault();
        var form = {};
        _.each(this.$('form').serializeArray(), function(element) {
            form[element.name] = element.value;
        });
        // console.log(form);
        // var note = new Note(form);
        // note.save();
        // notes_list.add(note);
        // console.log(note);
        // notes_list.create(form);
        this.model.set(form);
        /*
         if (this.model.isNew()) {
         this.collection.add(this.model);
         }*/

        this.model.save();
    },

    select : function(event) {
        // console.log(this);
        // console.log('select');
        this.$(event.target).select();
    }
});

var NotesListView = Backbone.View.extend({
    // el : $('#notes-list'),
    tagName : 'div',
    id : 'notes-list',
    tpl : tpl.notes_list_tpl,
    events : {

    },

    initialize : function() {
        _.bindAll(this, 'render', 'add_one', 'add_all');

        this.collection = this.options.collection;
        // this.ul = this.$('ul');

        this.collection.on('add', this.add_one);
        this.collection.on('reset', this.add_all);
    },

    render : function() {
        this.$el.html(this.tpl());
        this.collection.fetch({
            success : function(resp) {
                console.log('resp');
                console.log(resp);
            },
            error : function() {
                console.log('error');
            },
        });
        console.log(this.collection);
        A = this.collection;
        return this;
    },

    add_one : function(note) {
        var view = new NoteItemView({
            'model' : note,
        });
        this.$('ul').append(view.render().el);
    },

    add_all : function() {
        this.$('ul').empty();
        this.collection.each(this.add_one);
    }
});

var NoteRouter = Backbone.Router.extend({
    $el : $('#main div.container'),
    routes : {
        "" : "index",
        "notes" : "notes_list",
        "note/:query" : "note_detail",
        "new" : "note_create",
    },

    initialize : function() {
        // console.log(this.options);
        // console.log(options);
        // this.$el = this.options.$el;
        this.notes_list = new NotesList();
        console.log('new router.');
    },

    index : function() {

    },

    notes_list : function() {
        var notes_list_view = new NotesListView({
            collection : this.notes_list,
        });
        // console.log(this.$el);
        this.$el.html(notes_list_view.render().el);
    },

    note_create : function() {
        var note_edit_view = new NoteEditView({
            collection : this.notes_list,
        });
        this.$el.html(note_edit_view.render().el);
    }
});

var router = new NoteRouter({
    $el : $('#main div.container'),
});
Backbone.history.start();
/*
 var notes_list = new NotesList();
 var notes_list_view = new NotesListView({
 collection : notes_list,
 });

 $('button[name="new"]').on('click', function() {
 var note_edit_view = new NoteEditView({
 collection : notes_list,
 });
 note_edit_view.render();
 });*/

