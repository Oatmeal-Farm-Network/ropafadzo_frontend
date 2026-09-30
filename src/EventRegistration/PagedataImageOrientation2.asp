<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title> Image</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

<!--#Include file="globalvariables.asp"--> 
<!--#Include File="Header.asp"--> 



<%
filename=request.querystring("filename")

'rowcount = CInt
rowcount = 1
TempPageLayout2ID = Request.Form("TempPageLayout2ID")
response.write("TempPageLayout2ID=" & TempPageLayout2ID )
ImageCaption = Request.Form("Caption")
ImageID=Request.Form("OrientationImageID") 
ImageLink=Request.Form("ImageLink") 
'response.write("ImageLink=")
'response.write(ImageLink)
Orientation=Request.Form("Orientation") 
 rowcount =1

ImageLinkName = "ImageLink" & ImageID
ImageName = "Image" & ImageID
OrientationName = "ImageOrientation" & ImageID

Response.write("ImageCaption111=")
Response.write(ImageCaption)

str1 = ImageCaption
str2 = "'"
If InStr(str1,str2) > 0 Then
	ImageCaption= Replace(str1, "'", "''")
End If

Response.write("ImageCaption222=")
Response.write(ImageCaption)


str1 = ImageName
str2 = ","
If InStr(str1,str2) > 0 Then
	ImageName= Replace(str1, ",", "")
End If


str1 = OrientationName
str2 = ","
If InStr(str1,str2) > 0 Then
	OrientationName= Replace(str1, ",", "")
End If

str1 = lcase(ImageLink)
str2 = "http://"
If InStr(str1,str2) > 0 Then
	ImageLink= Replace(str1, str2, "")
End If

str1 = lcase(ImageLink)
str2 = "http:/"
If InStr(str1,str2) > 0 Then
	ImageLink= Replace(str1, str2, "")
End If




	Query =  " UPDATE EventPageLayout2 Set ImageOrientation = '" & Orientation & "' ,"
	Query =  Query & " ImageLink = '" & ImageLink & "', " 
	Query =  Query & " ImageCaption = '" & ImageCaption & "' "
    Query =  Query & " where PageLayout2ID = " & TempPageLayout2ID & ";"  
	response.write(Query)	




Conn.Execute(Query) 

	  rowcount= rowcount +1


Conn.Close
	Set Conn = Nothing 
Response.Redirect(filename )
%>

	
 </Body>
</HTML>
