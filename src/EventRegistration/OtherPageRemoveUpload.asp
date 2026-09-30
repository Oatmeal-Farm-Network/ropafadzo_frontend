<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "PageData2" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<meta http-equiv="Content-Language" content="en-us">

<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">    function EventTypeFormSubmit() { document.EventTypeForm.submit(); }</script>
<script type="text/javascript">    function EventServicesFormSubmit() { document.EventServicesForm.submit(); }</script>

</head>


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >
<!'--#Include file="AdminEventGlobalVariables.asp"--> 
<!'--#Include virtual="Header.asp"--> 


<%

'rowcount = CInt
rowcount = 1
EventID = request.querystring("EventID")
response.write("EventID=" & EventID & "<br>")
pagelayoutid = Request.QueryString("pagelayoutid")
response.write("pagelayoutid=" & pagelayoutid & "<br>" )
PageDownloadsID=Request.querystring("PageDownloadsID") 
if len(PageDownloadsID) > 0 then
else
PageDownloadsID=Request.Form("PageDownloadsID") 
end if


filenamex =Request.querystring("filename")
 rowcount =1
ImageName = "Image" & ImageID
CaptionName = "ImageCaption" & ImageID
PageLayout2ID = request.Form("PageLayout2ID")
'Response.write("CaptionName=")
'Response.write(CaptionName)

Query =  " Update EventPageLayout2 set Upload=' ' where PageLayout2ID = " &  PageLayout2ID & " and EventID=" & EventID 


response.write(Query)	

Conn.Execute(Query) 

	  rowcount= rowcount +1

Conn.Close
Set Conn = Nothing 
Response.Redirect("PageData2.asp?EventID=" & EventID & "&pagelayoutid=" & pagelayoutid )
 ' Response.write("filename =" & filename)
%>

	
 </Body>
</HTML>
