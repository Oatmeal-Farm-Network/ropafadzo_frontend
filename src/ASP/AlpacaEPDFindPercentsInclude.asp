<% 
Set rsEPD = Server.CreateObject("ADODB.Recordset")
Show1percentemblem = False
'response.write("Show1percentemblem=" & Show1percentemblem & "<br>")
sql = "select ID, epdalpacas.* from Animals, epdalpacas where  Animals.ID = epdalpacas.animalId and ID = " & ID

'response.write (sql)
rsEPD.Open sql, conn, 3, 3   
if Not rsEPD.eof  then
'ID=   rsEPD("ID")
AFD =   rsEPD("AFD")
AFDAcc =   rsEPD("AFDAcc")
AFDRank =   rsEPD("AFDRank")
AFDRank2 =   rsEPD("AFDRank2")

if len(AFDRank) > 1 and len(AFDRank2) > 1 then
AFDRankPercent = left((AFDRank /AFDRank2) * 100,4)

end if
SDAFD =   rsEPD("SDAFD")
SDAFDAcc =   rsEPD("SDAFDAcc")
SDAFDRank =   rsEPD("SDAFDRank")
SDAFDRank2 =   rsEPD("SDAFDRank2")
if len(SDAFDRank) > 1 and len(SDAFDRank2) > 1 then
SDAFDRankPercent = left((SDAFDRank /SDAFDRank2) * 100,4)
'response.write("SDAFDRankPercent=" & SDAFDRankPercent & "<br>")
if SDAFDRankPercent < 1.1 then 
Show1percentemblem = True
end if

end if
SF =   rsEPD("SF")
SFAcc =   rsEPD("SFAcc")
SFRank =   rsEPD("SFRank")
SFRank2 =   rsEPD("SFRank2")
if len(SFRank) > 1 and len(SFRank2) > 1 then
SFRankPercent = left((SFRank /SFRank2) * 100,4)
'response.write("SFRankPercent=" & SFRankPercent & "<br>")
if SFRankPercent < 1.1 then 
Show1percentemblem = True
end if
end if

PercentFGreaterThan30 = rsEPD("PercentFGreaterThan30")
percentFgreaterThan30Acc =   rsEPD("percentFgreaterThan30Acc")
percentFGreaterThan30Rank =   rsEPD("percentFGreaterThan30Rank")
percentFGreaterThan30Rank2 =   rsEPD("percentFGreaterThan30Rank2")
if len(percentFGreaterThan30Rank) > 1 and len(percentFGreaterThan30Rank2) > 1 then
percentFGreaterThan30RankPercent = left((percentFGreaterThan30Rank /percentFGreaterThan30Rank2) * 100,2)
'response.write("percentFGreaterThan30RankPercent=" & percentFGreaterThan30RankPercent & "<br>")

if percentFGreaterThan30RankPercent < 1.1 then 
Show1percentemblem = True
end if
end if

MC =   rsEPD("MC")
MCAcc =   rsEPD("MCAcc")
MCRank =   rsEPD("MCRank")
MCRank2 =   rsEPD("MCRank2")
if len(MCRank) > 1 and len(MCRank2) > 1 then
MCRankPercent = left((MCRank /MCRank2) * 100,4)
'response.write("MCRankPercent=" & MCRankPercent & "<br>")

if MCRankPercent < 1.1 then 
Show1percentemblem = True
end if
end if

SDMC =   rsEPD("SDMC")
SDMCAcc =   rsEPD("SDMCAcc")
SDMCRank =   rsEPD("SDMCRank")
SDMCRank2 =   rsEPD("SDMCRank2")
if len(SDMCRank) > 1 and len(SDMCRank2) > 1 then
SDMCRankPercent = left((SDMCRank /SDMCRank2) * 100,4)
'response.write("SDMCRankPercent=" & SDMCRankPercent & "<br>")
if SDMCRankPercent < 1.1 then 
Show1percentemblem = True
end if
end if

PercentM =   rsEPD("PercentM")
PercentMAcc =   rsEPD("PercentMAcc")
PercentMRank =   rsEPD("PercentMRank")
PercentMRank2 =   rsEPD("PercentMRank2")
if len(PercentMRank) > 1 and len(PercentMRank2) > 1 then
PercentMRankPercent = left((PercentMRank /PercentMRank2) * 100,4)
'response.write("PercentMRankPercent=" & PercentMRankPercent & "<br>")

if PercentMRankPercent < 1.1 then 
Show1percentemblem = True
end if
end if

MSL =   rsEPD("MSL")
MSLAcc =   rsEPD("MSLAcc")
MSLRank =   rsEPD("MSLRank")
MSLRank2 =   rsEPD("MSLRank2")
if len(MSLRank) > 1 and len(MSLRank2) > 1 then
MSLRankPercent = left((MSLRank /MSLRank2) * 100,4)
'response.write("MSLRankPercent=" & MSLRankPercent & "<br>")

if MSLRankPercent < 1.1 then 
Show1percentemblem = True
end if
end if

FW =   rsEPD("FW")
FWAcc =   rsEPD("FWAcc")
FWRank =   rsEPD("FWRank")
FWRank2 =   rsEPD("FWRank2")
if len(FWRank) > 1 and len(FWRank2) > 1 then
FWRankPercent = left((FWRank /FWRank2) * 100,4)
'response.write("FWRankPercent=" & FWRankPercent & "<br>")
if FWRankPercent < 1.1 then 
Show1percentemblem = True
end if
end if

BW =   rsEPD("BW")
BWAcc =   rsEPD("BWAcc")
EPDDate =   rsEPD("EPDDate")
end if

%>

