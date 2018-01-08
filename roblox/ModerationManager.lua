local Try = require(script.TryLibrary)
local BaseURL = "baseURL";

while wait(1) do

    local List = {}

    -- Get list of current player IDs
    for i, Player in pairs(game.Players:GetPlayers()) do
        table.insert(List, Player.UserId)
    end

    -- Check for banned players currently in-game
    Try(function ()
        return game.HttpService:JSONDecode(
            game.HttpService:PostAsync(BaseURL + '/bans/check/users', { players = game.HttpService:JSONEncode(List), token = TOKEN })
        )
    end)

    -- Kick returned banned players
    :Then(function (Response)
        for _, PlayerId in ipairs(Response) do
            local Player = game.Players:GetPlayerByUserId(PlayerId)
            if Player then
               Player:Kick('You have been banned. Please contact the game owner to appeal.');
            end
         end
    end)

    -- Catch errors
    :Catch(function (Error, Stack)
        warn(':x: [ServerCheck] Failed to parse ban data',
            '\n\nError:\n', Error,
            '\n\nStack:\n', Stack);
    end)

end