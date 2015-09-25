'''
Created on 25 Sep 2015

@author: peterb
'''


def json_team(team):
    result = team._serialize
    result["members"] = [p._serialize for p in team.members]
    return result


def json_lobby(lobby):
    result = lobby._serialize
    result["battleground"] = lobby.battleground.name if lobby.battleground else None
    result["teams"] = [json_team(team) for team in lobby.teams]
    return result