<HTML>
<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

		<!--#Include virtual="Globalvariables.asp"-->

 

<% 
'rowcount = CInt
rowcount = 1
dim ClassOrderArray(10000) 
dim ClassInfoIDArray(10000)

Action= Request.Form("Action")
EventID= Request.Querystring("EventID")
JudgeShow = Request.Form("JudgeShow")

'response.write("JudgeShow = " & JudgeShow )
	str1 =JudgeShow
	str2 = "HalterJudge"
	If InStr(str1,str2) > 0 Then
		HalterShowJudge = True
	End If 

'response.write("HalterShowJudge = " & HalterShowJudge & "<br>")

	str1 =JudgeShow
	str2 = "FleeceJudge"
	If InStr(str1,str2) > 0 Then
		FleeceShowJudge = True
	End If 

'response.write("FleeceShowJudge = " & FleeceShowJudge & "<br>")


	str1 =JudgeShow
	str2 = "SpinOffJudge"
	If InStr(str1,str2) > 0 Then
		SpinOffShowJudge = True
	End If 

'response.write("SpinOffShowJudge = " & SpinOffShowJudge & "<br>")

i=0

JudgeFirstName = Request.Form("JudgeFirstName")
JudgeLastName= Request.Form("JudgeLastName")
JudgeEmail= Request.Form("JudgeEmail")
JudgePhone= Request.Form("JudgePhone")
JudgeCell= Request.Form("JudgeCell")
JudgeFax= Request.Form("JudgeFax")
JudgeStreet= Request.Form("JudgeStreet")
JudgeApt= Request.Form("JudgeApt")
JudgeCity= Request.Form("JudgeCity")
JudgeState= Request.Form("JudgeState")
JudgeCountry= Request.Form("JudgeCountry")
JudgeZip= Request.Form("JudgeZip")
Website= Request.Form("Website")
JudgeBio= Request.Form("JudgeBio")

	str1 =Website
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Website= Replace(str1,  str2, "''")
	End If
	
	
	str1 =JudgeBio
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeBio= Replace(str1,  str2, "''")
	End If



	
	str1 =JudgeFirstName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeFirstName= Replace(str1,  str2, "''")
	End If  

	str1 =JudgeLastName
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeLastName= Replace(str1,  str2, "''")
	End If  

	str1 =JudgeEmail
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeEmail= Replace(str1,  str2, "''")
	End If 
	
	str1 =JudgePhone
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgePhone= Replace(str1,  str2, "''")
	End If 
	
	str1 =JudgeCell
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeCell= Replace(str1,  str2, "''")
	End If 
	
	str1 =JudgeFax
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeFax= Replace(str1,  str2, "''")
	End If 
	
	str1 =JudgeStreet 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeStreet= Replace(str1,  str2, "''")
	End If 
	
	str1 =JudgeApt 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeApt = Replace(str1,  str2, "''")
	End If 

	str1 =JudgeCity 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeCity = Replace(str1,  str2, "''")
	End If 

	str1 =JudgeState 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeState = Replace(str1,  str2, "''")
	End If 

	str1 =JudgeState 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeState = Replace(str1,  str2, "''")
	End If 

	str1 =JudgeZip 
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		JudgeZip = Replace(str1,  str2, "''")
	End If 

if len(JudgeFirstName) > 0 or len(JudgeLastName) > 0 or len(JudgeEmail) > 0 or len(JudgePhone) > 0 or len(JudgeCell) > 0 or len(JudgeFax) > 0 or len(JudgeStreet) > 0 or len(JudgeApt) > 0 or len(JudgeCity) > 0 or len(JudgeState) then 

Query =  "INSERT INTO Judges (JudgeStreet, JudgeFirstName, JudgeLastName, JudgeEmail, JudgeWebsite, JudgePhone, JudgeCell, JudgeFax,  JudgeBio,  JudgeApt, JudgeCity, JudgeState, EventID, JudgeZip)" 
	    Query =  Query + " Values ('" & JudgeStreet  & "'," 
	   Query =  Query & " '" &  JudgeFirstName & "', " 
		Query =  Query & " '" &  JudgeLastName & "', "    
		Query =  Query & " '" &  JudgeEmail & "', " 
		Query =  Query & " '" &  JudgeWebsite & "', " 
		Query =  Query & " '" &   JudgePhone & "', " 	 
		Query =  Query & " '" &   JudgeCell & "', " 
		Query =  Query & " '" &   JudgeFax & "', "
		Query =  Query & " '" &   JudgeBio & "', "
	    Query =  Query & " '" &  JudgeApt & "', " 
		Query =  Query & " '" &  JudgeCity & "', " 
		Query =  Query & " '" &  JudgeState & "', " 
		Query =  Query & " " &  session("EventID") & ", " 
		Query =  Query & " '" &  JudgeZip & "')" 
response.write(Query)
Conn.Execute(Query) 

sql = "select JudgeID from Judges where JudgeStreet = '" & JudgeStreet & "' and JudgeCity= '" & JudgeCity & "' and JudgeZip = '" & JudgeZip  & "' order by JudgeID Desc "

		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	ExistingEvent = False
	If Not rs.eof Then
			JudgeID = rs("JudgeID")
	response.write("JudgeID=" & JudgeID)

	End If 
rs.close

	


 
 
 if HalterShowJudge = True then
	 Query =  "INSERT INTO Judgesshows (JudgeID, EventID, ShowType)" 
	    Query =  Query & " Values (" & JudgeID & "," 
		 Query =  Query & " " &   session("EventID") & ", " 
		Query =  Query & " 'Halter')" 
		response.write("Query=" & Query)
		Conn.Execute(Query) 

 end if
	
  if FleeceShowJudge = True then
  	 	Query =  "INSERT INTO Judgesshows (JudgeID, EventID, ShowType)" 
	    Query =  Query & " Values (" & JudgeID & "," 
		 Query =  Query & " " &  session("EventID") & ", " 
		Query =  Query & " 'Fleece')" 
		response.write("Query=" & Query)
		Conn.Execute(Query) 

  end if
	
  if SpinOffShowJudge = True then
  	 Query =  "INSERT INTO Judgesshows (JudgeID, EventID, ShowType)" 
	    Query =  Query & " Values (" & JudgeID & "," 
		 Query =  Query & " " &   session("EventID") & ", " 
		Query =  Query & " 'SpinOff')" 
		response.write("Query=" & Query)
		Conn.Execute(Query) 

  end if 
  

end if

	
%>
</td></tr></table>

<%  Response.Redirect("JudgesEditJudgesDetails.asp?JudgeID=" & JudgeID ) %>
</Body>
</HTML>