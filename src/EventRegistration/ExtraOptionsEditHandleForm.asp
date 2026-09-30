
<HTML>
<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

		<!--#Include virtual="Globalvariables.asp"-->

 
<table width = "680" height = "300"  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>

		
<td class = "body" valign = "top">

<% 	ExtraOptionsName  = Request.Form("ExtraOptionsName")
	ExtraOptionsPrice  = Request.Form("ExtraOptionsPrice")
	ExtraOptionsQTYAvailable  = Request.Form("ExtraOptionsQTYAvailable")
	ExtraOptionsDescription  = Request.Form("ExtraOptionsDescription")
	AvaliableWithSponsorships  = Request.Form("AvaliableWithSponsorships")
	AvaliableByItself  = Request.Form("AvaliableByItself")
	ExtraOptionsID = Request.Form("ExtraOptionsID")
	
	
	str1 = ExtraOptionsName	
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		ExtraOptionsName= Replace(str1, "'", "''")
	End If

	str1 = ExtraOptionsDescription
		str2 = "'"
	If InStr(str1,str2) > 0 Then
		ExtraOptionsDescription= Replace(str1, "'", "''")
	End If


if len(ExtraOptionsQTYAvailable) > 0 then
else
  ExtraOptionsQTYAvailable = 0

end if


if len(ExtraOptionsPrice) > 0 then
else
  ExtraOptionsPrice = 0

end if



		Query =  " UPDATE ExtraOptions Set ExtraOptionsName = '" & ExtraOptionsName & "', " 
    	Query =  Query & "  ExtraOptionsPrice = " & ExtraOptionsPrice & ", " 
    	Query =  Query & "  ExtraOptionsQTYAvailable = " & ExtraOptionsQTYAvailable & ", " 
     	Query =  Query & "  ExtraOptionsDescription = '" & ExtraOptionsDescription & "' ," 
    	Query =  Query & "  AvaliableWithSponsorships = " & AvaliableWithSponsorships & ", " 
    	Query =  Query & " AvaliableByItself = " & AvaliableByItself & " "
     	Query =  Query & " where ExtraOptionsID = " & ExtraOptionsID & ";" 


	response.write("Query = " & Query & "<br>")

	
	Dim cmdDC, RecordSet
	Dim RecordToEdit, Updated
	Conn.Execute(Query) 

	  rowcount= rowcount +1

%>
</td></tr></table>

<% Message = "Your Extra Option Have Been Updated"
	Response.Redirect("ExtraOptionsEditDetails.asp?ExtraOptionsID=" & ExtraOptionsID & "&ExtraOptionsName=" & ExtraOptionsName & "&EventID=" & EventID ) %>

</Body>
</HTML>

