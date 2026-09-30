<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Remove Image</title>
       <link rel="stylesheet" type="text/css" href="style.css">


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >

<!--#Include file="AdminEventGlobalVariables.asp"-->
<!--#Include File="Header.asp"--> 



<%

'rowcount = CInt
rowcount = 1
EventID = request.querystring("EventID")
pagelayoutid = Request.QueryString("pagelayoutid")
response.write("pagelayoutid=" & pagelayoutid )
PageDownloadsID=Request.querystring("PageDownloadsID") 
filenamex =Request.querystring("filename")
 rowcount =1
ImageName = "Image" & ImageID
CaptionName = "ImageCaption" & ImageID
PageLayout2ID = request.Form("PageLayout2ID")
'Response.write("CaptionName=")
'Response.write(CaptionName)


Query =  "Delete From EventPageLayoutDownloads where PageDownloadsID = " &  PageDownloadsID & " and EventID=" & EventID 


response.write(Query)	

Conn.Execute(Query) 

	  rowcount= rowcount +1

Conn.Close
Set Conn = Nothing 
Response.Redirect("FormsAdmin.asp?EventID=" & EventID )
 ' Response.write("filename =" & filename)
%>

	
 </Body>
</HTML>
