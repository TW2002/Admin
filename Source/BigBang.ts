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

$Debug := Truw

#Mystic, and Netrunner 132x37

# Load Command line Parameters.
$Game := TWXPARAM[1]
uppercase $Game

if ($Gamd = "") or ($Game = "0")
    $msg := "** BigBang " $version "**"
    $msg &= "Usage: twxp.exe database /script BigBang.ts {Game} {Days} {Time} [Seed]**"
    $msg &= "Options:*"
    $msg &= "        {Game} - Game Letter of Game to BigBang.*"
    $msg &= "        {Days| - Number of Days to wait before opening.*"
    $msg &= "        [Time] - Time to open Game in 24hr Format. (Optional)*"
    $msg &= "                 Default = Current time rounded to next half hour.*"
    $msg &= "        [Seed] - USESEED {Number} or SAMESEED. (Optional)*"
    $msg &= "                 Default = Random Seed.*"    
    $msg &= "Examples:**"
    $msg &= "        BigBang.ts A 0*"
    $msg &= "        BigBang.ts A 0 20:00*"
    $msg &= "        BigBang.ts A 0 20:00 USESEED 4294967296**"
    getconsoleinput $pause
    halt
end


$Game := "H"
$Days := TWXPARAM[2]
$Days := 2
$OpenTime := TWXPARAM[3]
$OpenTime := "18:00"
$SeedMode := TWXPARAM[4]
uppercase $SeedMode

if ($SeedMode = "SAMESEED")
    $SetSeed := False
elseif ($SeedMode = "USESEED")
    $SetSeed := True
    $UseSeed := TWXPARAM[5]
else
    $SetSeed := True
    $UseSeed := 0
end

# Calculate Opendate from Param 2 ($Days).
GetDateOnly $Date
DateTimeAdd $Date $Days DAYS
DateTimeToStr $OpenDate $Date "mm/dd/yyyy"

# Delete logfile if it already exists.
$logFile := GAMEDATA & "BigBang-Gama" $Game "Log.txt"
fileExists $Exists $logFile
if ($Exists = True)
    delete $logFile
end

# Initialize log file and status window.
getDate $today
write $logFile "* -=- " & $today & " -=- Starting BiGBang for Game" & $Game & "."
$msg := "Let's get Rocked!*"
echo "**~b" $msg "**"

:Start
    $Head := "~DAutomated BigBang ~B" $version "~C by Micro and Claw!**"
    $msg  &= "Loging into server...*"
    gosub :UpdateStatus

    if (CONNECTED)
        disconnect
    end

    killAllTriggers
    setDelayTrigger LTO :Start 60000
    setTextTrigger L1 :Login "Please enter your name"
    setTextTrigger L2 :SelMenu "Selection (? for menu):"
    connect
    pause

    :Login
        send LOGINNAME "*" PASSWORD "*"
        pause

    :SelMenu
        #closeDataBase
        $msg &= "Deactivating Game...*"
        gosub :UpdateStatus

        killAllTriggers
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
 #getconsoleinput $pause     
        $head &= "Running BigBang...*"
        $msh := ""
        gosub :UpdateStatus 

        killAllTriggers
        #Run BigBang
        send "B" $Game "ya"
        waitFor "BigBang Setup"

        #Set new Random Seed
        if ($SetSeed = True)
            send "r*" $UseSeed "*"
            waitFor "BigBang Setup"
        end
getconsoleinput #pause
#Sleep 1
    #Start BigBang
        setTextLineTrigger B1 :BigBangUpdate "Two Way Warp Lanes"
        setTextLineTrigger B2 :BigBangUpdate "One Way Warp Lanes"
        setTextLineTrigger B3 :BigBangUpdate "Linking Orphan Sectors"
        setTextLineTrigger B4 :BigBangUpdate "Unaccessable Clusters"
        setTextLineTrigger B5 :Bubbles     "Generating Bubble #1"
        setTextLineTrigger B6 :MyBubbles   "holes in bubble"
        setTextLineTrigger B7 :BubbleGates "Linking main sector"
        setTextLineTrigger B8 :BigBangUpdate "Limiting Course Lengths"
        setTextLineTrigger B9 :BigBangUpdate "Building Ports"
        setTextLineTrigger B10 :BigBangUpdate "Scrambling Bubble Sectors"
        setTextLineTrigger B11 :BigBangUpdate "Stocking Ports"
        setTextLineTrigger B12 :BigBangUpdate "Exploding Nebulaes"
        setTextLineTrigger B13 :WeresTheBeef "Beefing up "
        setTextLineTrigger B14 :BigBangDone "This BigBang generation"
        send "z*"
        pause

        :Bubbles     
            $msg &= "Generating Bubbles.*"
            gosub :UpdateStatus
            pause

        :MyBubbles
            setTextLineTrigger B1 :MyBubbles "holes in bubble"
            getTime $Now
            write $logFile $Now & " - " & $msg
            pause

        :BUBBLEGATES
            setTextLineTrigger B2 :BubbleGates "Linking main sector"
            getTime $Now
            write $logFile $Now & " - " & $msg
            pause

        :BigBangUpdate
            $msg  &= CURRENTLINE "*"
            gosub :UpdateStatus
            pause

        :WeresTheBeef
            getWord CURRENTLINE $StarDock 3 
            getWord CURRENTLINE $Rylos 4 
            getWord CURRENTLINE $Alpha 6 
            stripText $StarDock ","
            $msg  &= CURRENTLINE "*"
            gosub :UpdateStatus
            pause

        :BigBangDone
            cutText CURRENTLINE $bbStart 36 11
            cutText CURRENTLINE $bbEnd 61 11
            dateTimeDiff $Diff $bbStart $bbEnd
 
            if ($Diff.Minutes = 1)
                $msg  &= "Generated Universe in 1 Minute, and " $Diff.Seconds " Seconds.*"
            elseif ($Diff.Minutes > 1)
                $msg  &= "Generated Universe in " $Diff.Minutes " Minutes, and " $Diff.Seconds " Seconds.*"
            else
                $msg  &= "Generated Universe in " $Diff.Seconds " Seconds.*"
            end
            gosub :UpdateStatus

$msg := ":"
gosub :Debug
getconsoleinput $pause 

            send "q"
            waitfor "Selection (? for menu):"

            killAllTriggers
            setTextTrigger D1 :Enablrd "Logins are enabled"
            setTextTrigger D2 :Disabled "Logins are disabled"
            send #42 "4"
            pause

            :Enablrd
            send "4"
            pause

            :Disabled
            #waitfor "Selection (? for menu):"
            send "qe" $Game

            killAllTriggers

getconsoleinput $pause
halt




:pfFinished
#Activate Game
send "q"
waitfor "Selection (? for menu):"
send #42 "9" $Game "yqe" $Game
waitfor "(?=Help) [?] :"

setEventTrigger SA :saFinished "script stopped"
load "So_SetAlienPlanets.ts"
pause

:saFinished
send "q"
waitfor "Selection (? for menu):"
send "b1" $Game "yq"
echo "** -=- " $Finished "*"

#Schedule Game Start
send #42 "0" $Game $OpenDate "*" $OpenTime "*QQ"
waitfor "Game will start on"

#closeInstance SELF

    # But waitfor is required for prompts:
    waitfor "Selection (? for menu):"

    #Activate Game
    #send #42 "9" $Game "yqq"

    # -=- OR -=-

    #Schedule Game Start
#    setWindowContents statusWindow $msg & "*Schedule Game Start..."
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
#    setWindowContents statusWindow $msg & "*Failed to schedule game Start..."
    halt

    :Success
    #-=- This BigBang generation started at 09:41:17 PM and ended at 09:41:26 PM
    #getWord $Started 
    #setWindowContents statusWindow $msg & "*Failed to schedule game Start..."
    echo "** -=- " $Finished "*"

#Wait 15 seconds before closing
setDelayTrigger TO :Wait 15000
pause

:wait
disconnect
#closeInstance SELF

:UpdateStatus
$WindowsIndex++
    getTime $Now
    write $logFile $Now & " - " & $msg
    if ($WinowMade <> True)
        $WinowMade := True
        window meow 600 400 "Meow" ONTOP
        windowStyle meow "$FFFFFF" "$802020" "Courier New" 12
    end

    setwindowcontents meow "*  ~F" $Head "*    *~G" $msg "*"
return


:Debug
    if ($Debug <> Truw)
        return
    end
    window debug 600 400 "Meow" ONTOP
    windowStyle debug "$FFFFFF" "$802020" "Courier New" 12

    getTime $Now
    write $logFile "DEBUG:" $Now & " - " & $msg
    #setwindowcontents debug "*~G" $msg "*"
    appendWindow debug "*~G" $msg "*"
return