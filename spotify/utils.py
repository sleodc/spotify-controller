from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/"

def get_user_tokens(session_id):
	user_token = SpotifyToken.objects.filter(user=session_id)
	if user_token.exists():
		return user_token[0]
	else:
		return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
	token = get_user_tokens(session_id)
	expires_in = timezone.now() + timedelta(seconds=expires_in)
	
	if token:
		token.access_token = access_token
		token.refresh_token = refresh_token
		token.expires_in = expires_in
		token.token_type = token_type
		token.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
	else:
		token = SpotifyToken(user=session_id, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
		token.save()

def is_spotify_authenticated(session_id):
	tokens = get_user_tokens(session_id)
	if tokens:
		expiry = tokens.expires_in
		if expiry <= timezone.now():
			refresh_spotify_token(session_id)
		return True

	return False

def refresh_spotify_token(session_id):
	refresh_token = get_user_tokens(session_id).refresh_token
	response = post('https://accounts.spotify.com/api/token', data = {
		'grant_type': 'refresh_token',
		'refresh_token': refresh_token,
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET
		}).json()
	access_token = response.get('access_token')
	token_type = response.get('token_type')
	expires_in = response.get('expires_in')

	update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False, data_={}):
	tokens = get_user_tokens(session_id)
	headers = {
		'Content-Type': "application/json",
		'Authorization': "Bearer " + tokens.access_token
	}
	# data = {
 #  		"context_uri": "spotify:playlist:2eKw8IiWRw2nKA1SyqTpBF",
 #  		"offset": {
 #    		"uri": "spotify:track:7MAibcTli4IisCtbHKrGMh"
 #  		}
	# }
	if post_:
		post(BASE_URL + endpoint, headers=headers)
	elif put_:
		put(BASE_URL + endpoint, headers=headers, json=data_)
	else:
		response = get(BASE_URL + endpoint, {}, headers=headers)
	try:
		return response.json()
	except:
		return {'Error': 'Issue with request'}

def play_song(session_id):
	return execute_spotify_api_request(session_id, "me/player/play", put_=True)

def pause_song(session_id):
	return execute_spotify_api_request(session_id, "me/player/pause", put_=True)

def skip_song(session_id):
	return execute_spotify_api_request(session_id, "me/player/next", post_ = True)

def add_song(session_id, playlist_id, song):
	endpoint = "playlists/" + playlist_id + '/tracks?uris=' + song
	return execute_spotify_api_request(session_id, endpoint, post_=True)

def get_playlist(session_id, playlist_id):
	endpoint = "playlists/" + playlist_id
	return execute_spotify_api_request(session_id, endpoint)

def playlist_song(session_id, uri):
	data = {
  		"context_uri": "spotify:playlist:2eKw8IiWRw2nKA1SyqTpBF",
  		"offset": {
    		"uri": uri
  		}
	}
	return execute_spotify_api_request(session_id, "me/player/play", put_=True, data_=data)
	