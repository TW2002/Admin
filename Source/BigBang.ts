######################W################################
# BigBang - by Micro and Claw
# Copyright (c) 2023 - David McCartney
# All Rights Reserved.
####################################
# Automates BigBang for un-attended operation.
##################
# 230209 Initial realease
#
# TODO: DayZero.ts
$version := "v23.03a"
reqversion 2.6.25
reqrecording

$Game := TWXPARAM[1]
$Game := "H"
$Days := TWXPARAM[2]
$Days := 2
$OpenTime := TWXPARAM[3]
$OpenTime := "18:00"

if ($Game = "") or ($Game = "0")
    Gosub :MainMenu
end

CopyDatabase 

getDate $today
$logFile := "BigBang-Game" $Game ".txt"
write $farmLogFile "* -=- " & $today & " -=- Starting BiGBang for Game" & $Game & "."
Window statusWindow 300 200 "Dory Planet Master " & $version & " by MicroBlaster  "  ONTOP

$msg := "Automated BigBang."
echo "**" $msg "**"
gosub :UpdateStatus




GetDateOnly $Date
DateTimeAdd $Date $Days DAY
DateTimeToStr $OpenDate $Date "mm/dd/yyyy"

:Start
setWindowContents statusWindow $msg & "**Loging into server..."

if (CONNECTED)
    disconnect
end

setDelayTrigger    TO :Start 60000
setTextTrigger T4 :Login "Please enter your name"
setTextTrigger T3 :SelMenu "Selection (? for menu):"
connect
pause

:Login
    send NAME "*" PASSWORD "*"
    pause

:SelMenu
    setWindowContents statusWindow $msg & "**Deactiving Game..."

    killAllTriggers

    #Take Game Offline

    setTextTrigger A1 :Active "as INACTIVE.  Are you sure?"
    setTextTrigger A2 :Inactive "as ACTIVE.  Are you sure?"
    send #42 "9" $Game
    pause
    
    :Active
    send "yq"
    goto :BigBang
    
    :Inactive
    send "n*q"
    goto :BigBang
    
    :BigBang
    $msg &= "**Running BigBang..."
    setWindowContents statusWindow $msg 

    killAllTriggers
    #Run BigBang
    send "B" $Game "ya"
    waitFor "BigBang Setup"

    #Set new Random Seed
    send "r*0*"
    waitFor "BigBang Setup"

    #Start BigBang
    send "z*"
    # Using WaitON, because we want to capture the line.
    WaitOn "This BigBang generation"
    $Finished := CURRENTLINE

    setWindowContents statusWindow $msg & "*Finished."

    # But waitfor is required for prompts:
    waitfor "Selection (? for menu):"

    #Activate Game
    #send #42 "9" $Game "yqq"

    # -=- OR -=-

    #Schedule Game Start
    setWindowContents statusWindow $msg "*Schedule Game Start..."
    killAllTriggers
    setTextLineTrigger T1 :Success "Game will start on"
    setTextLineTrigger T2 :TryAgain "Please enter the time"
    send #42 "0" $Game $OpenDate "*" $OpenTime "*"
    pause

    :TryAgain
    # TEDIT was randomly failing to set the time, so I added this.
    setTextLineTrigger T2 :Failed "Please enter the time"
    send $OpenTime "*"
    pause

    :Failed
    setWindowContents statusWindow $msg "*Failed to schedule game Start..."
    halt

    :Success
    #-=- This BigBang generation started at 09:41:17 PM and ended at 09:41:26 PM
    getWord $Started 
    setWindowContents statusWindow $msg "*Failed to schedule game Start..."
    echo "** -=- " $Finished "*"

#Wait 15 seconds before closing
setDelayTrigger TO :Wait 15000
pause

:wait
disconnect
closeInstance SELF

:UpdateStatus
    getDateTime $Now
    setWindowContents statusWindow $head $msg
    write $logFile 