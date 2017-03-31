from tethys_sdk.base import TethysAppBase, url_map_maker


class WatershedDelinExample(TethysAppBase):
    """
    Tethys app class for Watershed Delin Example.
    """

    name = 'Watershed Delineation Example App'
    index = 'watershed_delin_example:home'
    icon = 'watershed_delin_example/images/icon.gif'
    package = 'watershed_delin_example'
    root_url = 'watershed-delin-example'
    color = '#e67e22'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='watershed-delin-example',
                           controller='watershed_delin_example.controllers.home'),
        )

        return url_maps