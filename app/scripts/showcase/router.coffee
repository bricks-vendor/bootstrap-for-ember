Showcase.Router.map(() ->
    @resource 'show_components', ->
        @route 'alert'
        @route 'modal'
        @route 'list-group'
        @route 'panel'
        @route 'button'
        @route 'buttonGroup'
        @route 'progressbar'
        @route 'pills'
        @route 'tabs'
        @route 'tabs-panes'
        @route 'wizard'
        @route 'tabs-with-routes'
        @route 'notifications'
        @route 'growl-notif'
        @route 'popover'
        @resource('user', ->
            @route ('general')
            @route ('privacy')
            @route ('activities')
        )
)