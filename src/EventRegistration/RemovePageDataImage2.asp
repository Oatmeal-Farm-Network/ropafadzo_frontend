<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Remove Image</title>
       <link rel="stylesheet" type="text/css" href="style.css">


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >

<!--#Include file="globalvariables.asp"--> 
<!--#Include File="Header.asp"--> 



<%
filename=Request.Querystring("filename")
'rowcount = CInt
rowcount = 1

ImageID=Request.Form("ImageID") 
 rowcount =1
ImageName = "Image" & ImageID
CaptionName = "ImageCaption" & ImageID
PageLayout2ID = request.Form("PageLayout2ID")
'Response.write("CaptionName=")
'Response.write(CaptionName)

str1 = ImageName
str2 = ","
If InStr(str1,str2) > 0 Then
	ImageName= Replace(str1, ",", "")
End If


str1 = CaptionName
str2 = ","
If InStr(str1,str2) > 0 Then
	CaptionName= Replace(str1, ",", "")
End If


if ImageID = "0" then
Query =  " UPDATE Pagelayout Set HeaderImage = '0'  " 
Query =  Query & " where PageName = '" & Session("PageName") & "'" 


else

	Query =  " UPDATE EventPagelayout2 Set Image = '0' , " 
	Query =  Query & " ImageCaption   = '0'," 
	Query =  Query & " ImageOrientation  = 'Right'," 
	Query =  Query & " ImageLink  = '0'" 
	Query =  Query & " where PageLayout2ID = " & PageLayout2ID & "" 
end if
response.write(Query)	

Conn.Execute(Query) 

	  rowcount= rowcount +1


	Conn.Close
	Set Conn = Nothing 
 Response.Redirect(filename )
 ' Response.write("filename =" & filename)
%>

	
 </Body>
</HTML>
