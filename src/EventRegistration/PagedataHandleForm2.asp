<html>
<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >
<!--#Include file="Globalvariables.asp"-->


<%
'rowcount = CInt
rowcount = 1

Dim TextBlock
Dim Heading
Dim Text
Return = Request.querystring("Return")
response.write("return=" & Return)
TextBlock= Request.Form("TextBlock")
Heading = Request.Form("Heading")
response.write("Heading=" & Heading)


'rowcount = CInt
rowcount = 1
filename=request.querystring("filename")
Return = Request.querystring("Return")
response.write("return=" & Return)
TextBlock= Request.Form("TextBlock")
PageLayout2ID = Request.Form("TempPageLayout2ID")
PageLayoutID = Request.Form("PageLayoutID")
	  
	response.write("PageLayoutID=" & PageLayoutID)

Heading = Request.Form("Heading")
response.write("Heading=" & Heading )
ImageID=Request.Form("ImageID")

Text1= Request.Form("Text") 
Text2= Request.Form("Text2") 
Text3= Request.Form("Text3") 
Text4= Request.Form("Text4") 
Text5= Request.Form("Text5") 
Text6= Request.Form("Text6") 
Text7= Request.Form("Text7") 
Text8= Request.Form("Text8") 
Text9= Request.Form("Text9") 
Text10= Request.Form("Text10") 
Text11= Request.Form("Text11") 
Text12= Request.Form("Text12") 
Text13= Request.Form("Text13") 
Text14= Request.Form("Text14") 
Text15= Request.Form("Text15") 
Text16= Request.Form("Text16") 


text = Text1 & Text2 & Text3  & Text4  & Text5  & Text6  & Text7  & Text8  & Text9  & Text10  & Text11  & Text12  & Text13  & Text14  & Text15  & Text16
response.write("text = " & text )
	Dim str1
	Dim str2
	str1 = text
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "''")
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
	str2 = vbNullChar
	If InStr(str1,str2) > 0 Then
		text= Replace(str1,  str2, "&nbsp;")
	End If 



response.write("text2=" & text)





	str1 = heading
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		heading= Replace(str1,  str2, "''")
	End If  






	str1 = Heading
	str2 = vbCrLf
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "<br>")
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
		Heading= Replace(str1,  str2, "<br>")
	End If  

	str1 = Heading
	str2 =vbFormFeed
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "<br>")
	End If  

	str1 = Heading
	str2 = vbNullChar
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "&nbsp;")
	End If 

	str1 =Heading
	str2 =vbNewline
	If InStr(str1,str2) > 0 Then
		Heading= Replace(str1,  str2, "<br>")
	End If  





	Query =  " UPDATE EventPageLayout2 Set PageHeading = '" & Heading & "', "
	Query =  Query & " PageText = '" & Text & "'," 
	Query =  Query & " BlockNum = " & TextBlock & " " 
    Query =  Query & " where PageLayout2ID = " & PageLayout2ID & ";"  
	response.write(Query)	

	Conn.Execute(Query) 



sql2 = "select * from EventPageLayout2 where  PageLayoutID = " & PageLayoutID & ";"  
	'response.write("Reg Home sql2 = " & sql2 & "<br/>")
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
		totalBlocks = rs2.recordcount - 1
	rs2.close
	
	'response.write("totalBlocks=" & totalBlocks)
	  
	'response.write("TextBlock=" & TextBlock)

   if cint(totalBlocks) = cint(TextBlock) then
   
   	Query =  "INSERT INTO EventPageLayout2 (PageLayoutID, BlockNum  )" 
	Query =  Query & " Values (" &  PageLayoutID & "," 
	Query =  Query & " '" & totalBlocks + 1  & "')"

	'response.write(Query)	

	Conn.Execute(Query) 
   
   end if
   

set Conn = Nothing

if len(Return)> 1 then
 'Response.Redirect("PageDataHomePage.asp")
else

Response.Redirect(filename & "&EventID=" & EventID & "&Header=Other#" & TextBlock )
end if
 %>
</Body>
</HTML>

