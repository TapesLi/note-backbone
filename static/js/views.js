App.Views.NoteItemView = Backbone.View.extend({
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

App.Views.NoteDetailView = Backbone.View.extend({
    tagName : 'div',
    id : 'note-detail',
    tpl : tpl.note_detail_tpl,
    initialize : function() {
        this.model = this.options.model;
    },
    render : function() {
        this.$el.html(this.tpl(this.model.toJSON()));
        return this;
    },
});

App.Views.NoteEditView = Backbone.View.extend({
    tagName : 'div',
    id : 'note-edit',
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
        this.model = this.options.models || (new this.options.collection.model());
    },

    render : function() {
        this.$el.append(this.tpl(this.model.toJSON()));
        return this;
    },
    cancel : function(event) {
        event.preventDefault();
        this.$el.remove();
    },
    save : function(event) {
        event.preventDefault();
        var form = {};
        _.each(this.$('form').serializeArray(), function(element) {
            form[element.name] = element.value;
        });
        // this.model.set(form);
        this.model.save(form, {
            success : function() {
                $('body').prepend(new App.Views.Alert().render().el);
            },
            error : function() {
                $('body').insert(new App.Views.Alert());
            },
        });
    },

    select : function(event) {
        this.$(event.target).select();
    }
});

App.Views.NotesListView = Backbone.View.extend({
    tagName : 'div',
    id : 'notes-list',
    tpl : tpl.notes_list_tpl,
    events : {
    },

    initialize : function() {
        _.bindAll(this, 'render', 'add_one', 'add_all');
        this.collection = this.options.collection;
        this.collection.on('add', this.add_one);
        this.collection.on('reset', this.add_all);
    },

    render : function() {
        this.$el.html(this.tpl());
        this.collection.fetch({
            success : function(resp) {
                console.log('success');
            },
            error : function() {
                console.log('failed');
            },
        });
        return this;
    },

    add_one : function(note) {
        var view = new App.Views.NoteItemView({
            'model' : note,
        });
        this.$('ul').append(view.render().el);
    },

    add_all : function() {
        this.$('ul').empty();
        this.collection.each(this.add_one);
    }
});

App.Views.Alert = Backbone.View.extend({
    tagName : 'div',
    className : 'alert',
    tpl : tpl.alert_tpl,

    events : {
        'click button.close' : 'close',
    },

    initialize : function() {
        _.bindAll(this, 'render', 'close');
    },

    render : function() {
        this.$el.html(this.tpl({
            'message' : 'You have save a note.'
        }));
        setTimeout(_.bind(function() {
            this.close();
        }, this), 5000);
        return this;
    },

    close : function() {
        this.$el.remove();
    },
});
