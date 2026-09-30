<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Set AOBA Fees</title>
       <link rel="stylesheet" type="text/css" href="style.css">
</HEAD>

<BODY bgcolor = "white">

		<!--#Include file="globalvariables.asp"--> 
<%
EventID = Request.Form("EventID")
AOBA= Request.Form("AOBA")
AOBAFee= Request.Form("AOBAFee")

if len(AOBAFee) > 0 then
else
  AOBAFee = "0"
end if


'**************************************************************************************************************
' UPDATE THE EVENT TABLE 
'**************************************************************************************************************
Query =  " UPDATE Event Set AOBA = " &  AOBA & ", "
Query =  Query & " AOBAFee = " & AOBAFee & " "
Query =  Query & " where EventID = " & EventID & ";" 


'response.write(Query)
Conn.Execute(Query) 

response.redirect("RegmanageHome.asp?EventID=" & EventID)
%>

 </Body>
</HTML>
