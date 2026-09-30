<!DOCTYPE HTML>

<HTML>
<HEAD>
<!--#Include file="AdminEventGlobalVariables.asp"-->

 <title>Account Maintanance</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<%
EventID = request.Querystring("EventID")

JudgeID = request.form("JudgeID")
if len(JudgeID)> 0 then
else
JudgeID = request.querystring("JudgeID")
end if 

JudgeShow = Request.Form("JudgeShow")

response.write("JudgeShow = " & JudgeShow & "<br>")
	str1 =JudgeShow
	str2 = "HalterJudge"
	If InStr(str1,str2) > 0 Then
		HalterShowJudge = True
	End If 

response.write("HalterShowJudge = " & HalterShowJudge & "<br>")

	str1 =JudgeShow
	str2 = "FleeceJudge"
	If InStr(str1,str2) > 0 Then
		FleeceShowJudge = True
	End If 

response.write("FleeceShowJudge = " & FleeceShowJudge & "<br>")


	str1 =JudgeShow
	str2 = "SpinOffJudge"
	If InStr(str1,str2) > 0 Then
		SpinOffShowJudge = True
	End If 

response.write("SpinOffShowJudge = " & SpinOffShowJudge & "<br>")


JudgeID = request.form("JudgeID")
JudgeWebsite = request.form("JudgeWebsite")
SponsorID = request.form("SponsorID")
JudgeFirstName = request.form("JudgeFirstName")
JudgeLastName = request.form("JudgeLastName")
JudgeEmail = request.form("JudgeEmail")
JudgePhone = request.form("JudgePhone")
JudgeCell = request.form("JudgeCell")
JudgeFax = request.form("JudgeFax")
JudgeStreet = request.form("JudgeStreet")
JudgeApt = request.form("JudgeApt")
JudgeCity = request.form("JudgeCity")
JudgeState = request.form("JudgeState")
JudgeZip = request.form("JudgeZip")			
JudgeCountry = request.form("JudgeCountry")
Delete= request.querystring("Delete")
JudgeBio = request.form("JudgeBio")

rowcount = 1


str1 =Lcase(JudgeWebsite)
	str2 = "http://"
	If InStr(str1,str2) > 0 Then
		JudgeWebsite= Replace(str1,  str2, "")
	End If 
	
	str1 =Lcase(JudgeWebsite)
	str2 = "http:/"
	If InStr(str1,str2) > 0 Then
		JudgeWebsite= Replace(str1,  str2, "")
	End If 
	
	str1 =Lcase(JudgeWebsite)
	str2 = "http:"
	If InStr(str1,str2) > 0 Then
		JudgeWebsite= Replace(str1,  str2, "")
	End If 
	
	str1 =Lcase(JudgeWebsite)
	str2 = "http"
	If InStr(str1,str2) > 0 Then
		JudgeWebsite= Replace(str1,  str2, "")
	End If 


if Delete = "True" then
	Query =  "Delete * From Judge where JudgeID = " & JudgeID & ";" 
	Conn.Execute(Query) 
	
	Query =  "Delete * From Judge where JudgeID = " & JudgeID & ";" 
	Conn.Execute(Query)
Else
	str1 = JudgeFirstName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeFirstName= Replace(str1, "'", "''")
	End If
	
	
	str1 = JudgeBio
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeBio= Replace(str1, "'", "''")
	End If




	str1 = JudgeLastName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeLastName= Replace(str1, "'", "''")
	End If


	str1 = JudgeEmail
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeEmail= Replace(str1, "'", "''")
	End If

	str1 = JudgePhone
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgePhone= Replace(str1, "'", "''")
	End If

	str1 = JudgeCell
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeCell= Replace(str1, "'", "''")
	End If


	str1 = JudgeFax
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeFax= Replace(str1, "'", "''")
	End If

	str1 = JudgeStreet
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeStreet= Replace(str1, "'", "''")
	End If

	str1 = JudgeApt
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeApt= Replace(str1, "'", "''")
	End If


	str1 = JudgeCity
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeCity= Replace(str1, "'", "''")
	End If


	str1 = JudgeState
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeState= Replace(str1, "'", "''")
	End If

	str1 = JudgeZip
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeZip= Replace(str1, "'", "''")
	End If

	str1 = JudgeCountry
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeCountry= Replace(str1, "'", "''")
	End If
	

	str1 = JudgeWebsite
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		judgeWebsite= Replace(str1, "'", "''")
	End If
			


'****************************************************************************************************
'  UPDATE THE  Judge INTO THE Judge TABLE 
'****************************************************************************************************
Query =  " UPDATE Judges Set JudgeFirstName = '" &  JudgeFirstName & "' ,"
Query =  Query & " JudgeLastName  = '" &  JudgeLastName & "'," 
Query =  Query & " Judgefax  = '" &  Judgefax & "',"
Query =  Query & " JudgeWebsite  = '" &  JudgeWebsite & "',"
Query =  Query & " Judgeemail  = '" &  Judgeemail & "',"
Query =  Query & " JudgeCell  = '" &  JudgeCell & "',"
Query =  Query & " JudgePhone = '" &  JudgePhone & "',"
Query =  Query & " JudgeStreet = '" &  JudgeStreet & "' ,"
Query =  Query & " JudgeApt  = '" &  JudgeApt & "'," 
Query =  Query & " JudgeCity  = '" &  JudgeCity & "'," 
Query =  Query & " JudgeState  = '" &  JudgeState & "'," 
Query =  Query & " JudgeZip = '" &  JudgeZip & "'," 
Query =  Query & " JudgeCountry = '" &   JudgeCountry & "'," 
Query =  Query & " JudgeBio = '" &   JudgeBio & "'" 
Query =  Query & " where JudgeID = " & JudgeID & "" 
response.write("Judge update = " & Query & "<br>")
Conn.Execute(Query) 


	
'****************************************************************************************************
'   UPDATE JUDGESHOWS TABLE
'****************************************************************************************************
	
	
	Query =  "Delete from Judgesshows where  EventID = " & EventID & " and JudgeID= " & JudgeID 
	Conn.Execute(Query) 
	
	
 if HalterShowJudge = True then
	 Query =  "INSERT INTO Judgesshows (JudgeID, EventID, ShowType)" 
	    Query =  Query & " Values (" & JudgeID & "," 
		 Query =  Query & " " &  EventID & ", " 
		Query =  Query & " 'Halter')" 
		response.write("Query=" & Query)
		Conn.Execute(Query) 

 end if
	
  if FleeceShowJudge = True then
  	 	Query =  "INSERT INTO Judgesshows (JudgeID, EventID, ShowType)" 
	    Query =  Query & " Values (" & JudgeID & "," 
		 Query =  Query & " " &  EventID & ", " 
		Query =  Query & " 'Fleece')" 
		'response.write("Query=" & Query)
		Conn.Execute(Query) 

  end if
	
  if SpinOffShowJudge = True then
  	 Query =  "INSERT INTO Judgesshows (JudgeID, EventID, ShowType)" 
	    Query =  Query & " Values (" & JudgeID & "," 
		 Query =  Query & " " &  EventID & ", " 
		Query =  Query & " 'SpinOff')" 
		'response.write("Query=" & Query)
		Conn.Execute(Query) 

  end if 




end if




response.write("delete = " & Delete & " <br>")

if Delete = "True" then
             'response.write("JudgeEditJudges.asp?EventID=" & EventID & "&JudgeID=" & JudgeID)

	'response.redirect("JudgeEditJudges.asp?EventID=" & EventID & "&JudgeID=" & JudgeID)
Else

  response.redirect("JudgesEditJudgesDetails.asp?EventID=" & EventID & "&JudgeID=" & JudgeID & "&Completion=True")
end if
%>
 </Body>
</HTML>
