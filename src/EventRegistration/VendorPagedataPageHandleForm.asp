<HEAD>

       <link rel="stylesheet" type="text/css" href="/Administration/style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

		<!--#Include virtual="/Administration/Globalvariables.asp"-->

 
<table width = "680" height = "300"  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>

		
<td class = "body" valign = "top">

<% 
'rowcount = CInt
rowcount = 1

Dim TextBlock
Dim Heading
Dim Text
PageName= Request.Form("PageName")
TextBlock= Request.Form("TextBlock")
Heading = Request.Form("Heading")
Text= Request.Form("Text") 
SectionTitle =request.Form("SectionTitle")
PageLayoutID=request.Form("PageLayoutID")
response.write("PageLayoutID =" & PageLayoutID)

Publish=request.Form("Publish")

	Dim str1
	Dim str2
	str1 = text
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "''")
	End If  

	str1 = text
	str2 = vbCrLf
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "</br>")
	End If  

	str1 = text
	str2 = vbtab
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "&nbsp;&nbsp;&nbsp;&nbsp;")
	End If 

	str1 = text
	str2 = vbVerticalTab
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "&nbsp;&nbsp;&nbsp;&nbsp;")
	End If 

	str1 = text
	str2 = vbLf 
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "&nbsp;")
	End If 

	str1 = text
	str2 = vbCr
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "</br>")
	End If  

	str1 = text
	str2 =vbFormFeed
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "</br>")
	End If  

	str1 = text
	str2 = vbNullChar
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "&nbsp;")
	End If 

	str1 = text
	str2 =vbNewline
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "</br>")
	End If  


str1 =SectionTitle
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "''")
	End If  

	str1 = SectionTitle
	str2 = vbCrLf
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "</br>")
	End If  

	str1 = SectionTitle
	str2 = vbtab
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "&nbsp;&nbsp;&nbsp;&nbsp;")
	End If 

	str1 =SectionTitle
	str2 = vbVerticalTab
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "&nbsp;&nbsp;&nbsp;&nbsp;")
	End If 

	str1 = SectionTitle
	str2 = vbLf 
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "&nbsp;")
	End If 

	str1 = SectionTitle
	str2 = vbCr
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "</br>")
	End If  

	str1 = SectionTitle
	str2 =vbFormFeed
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "</br>")
	End If  

	str1 = SectionTitle
	str2 = vbNullChar
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "&nbsp;")
	End If 

	str1 =SectionTitle
	str2 =vbNewline
	If InStr(str1,str2) > 0 Then
		SectionTitle= Replace(str1,  str2, "</br>")
	End If  

	str1 =Heading
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "''")
	End If  

	str1 = Heading
	str2 = vbCrLf
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "</br>")
	End If  

	str1 = Heading
	str2 = vbtab
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "&nbsp;&nbsp;&nbsp;&nbsp;")
	End If 

	str1 =Heading
	str2 = vbVerticalTab
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "&nbsp;&nbsp;&nbsp;&nbsp;")
	End If 

	str1 = Heading
	str2 = vbLf 
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "&nbsp;")
	End If 

	str1 = Heading
	str2 = vbCr
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "</br>")
	End If  

	str1 = Heading
	str2 =vbFormFeed
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "</br>")
	End If  

	str1 = Heading
	str2 = vbNullChar
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "&nbsp;")
	End If 

	str1 =Heading
	str2 =vbNewline
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "</br>")
	End If  

response.write("TextBlock =" & TextBlock )
If TextBlock = "Heading" Then

	Query =  " UPDATE PageLayout Set PageTitle = '" & Text & "' "
   'Query =  Query & " PageName = '" & PageName & "',"  
    '  Query =  Query & " Publish = " & Publish & ""  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	
	response.write("DatabasePath=" & DatabasePath)	
    Conn.Execute(Query) 

End If 

response.write("TextBlock=" & TextBlock)

response.write("PageLayoutID=" & PageLayoutID)

If TextBlock = "TB1" Then

	Query =  " UPDATE PageLayout Set PageHeading1 = '" & Heading & "', "
	Query =  Query & " SectionTitle1 = '" & SectionTitle & "',"  
	Query =  Query & " PageText = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"   
	response.write(Query)	
	Conn.Execute(Query) 

End If 

If TextBlock = "TB2" Then
	Query =  " UPDATE PageLayout Set PageHeading2 = '" & Heading & "', "
	Query =  Query & " SectionTitle2 = '" & SectionTitle & "',"  
	Query =  Query & " PageText2 = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	response.write(Query)	
	Conn.Execute(Query) 
End If 

If TextBlock = "TB3" Then
	Query =  " UPDATE PageLayout Set PageHeading3 = '" & Heading & "', "
	Query =  Query & " SectionTitle3 = '" & SectionTitle & "',"  
	Query =  Query & " PageText3 = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	response.write(Query)	
	Conn.Execute(Query) 
End If 

If TextBlock = "TB4" Then
	Query =  " UPDATE PageLayout Set PageHeading4 = '" & Heading & "', "
	Query =  Query & " SectionTitle4 = '" & SectionTitle & "',"  
	Query =  Query & " PageText4 = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	response.write(Query)	
	Conn.Execute(Query) 
End If 

If TextBlock = "TB5" Then
	Query =  " UPDATE PageLayout Set PageHeading5 = '" & Heading & "', "
	Query =  Query & " SectionTitle5 = '" & SectionTitle & "',"  
	Query =  Query & " PageText5 = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	response.write(Query)	
	Conn.Execute(Query) 
End If 

If TextBlock = "TB6" Then
	Query =  " UPDATE PageLayout Set PageHeading6 = '" & Heading & "', "
	Query =  Query & " SectionTitle6 = '" & SectionTitle & "',"  
	Query =  Query & " PageText6 = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	response.write(Query)	 
	Conn.Execute(Query) 
End If 

If TextBlock = "TB7" Then
	Query =  " UPDATE PageLayout Set PageHeading7 = '" & Heading & "', "
	Query =  Query & " SectionTitle7 = '" & SectionTitle & "',"  
	Query =  Query & " PageText7 = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	response.write(Query)	
	Conn.Execute(Query) 
End If 

If TextBlock = "TB8" Then
	Query =  " UPDATE PageLayout Set PageHeading8 = '" & Heading & "', "
	Query =  Query & " SectionTitle8 = '" & SectionTitle & "',"  
	Query =  Query & " PageText8 = '" & Text & "'"  
    Query =  Query & " where PageLayoutID = " & PageLayoutID & " ;"  
	response.write(Query)	
	Conn.Execute(Query) 
End If 

IF DataConnection.Errors.Count <> 0 then
     Call MyErrorHandler(oDBConn, sSQL)  ' pass database connection as param
 End If
%>
</td></tr></table>

<% Response.Redirect("Vendorspagedata.asp?showname=" & PageName ) %>
</Body>
</HTML>