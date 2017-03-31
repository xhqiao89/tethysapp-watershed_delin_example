from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import TextInput,Button


@login_required()
def home(request):
    """
    Controller for the app home page.
    """

    context = {
               }

    return render(request, 'watershed_delin_example/home.html', context)