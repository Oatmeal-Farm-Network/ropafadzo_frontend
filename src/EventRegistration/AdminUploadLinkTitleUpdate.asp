<!DOCTYPE HTML >

<HTML>
<HEAD>
 <title>Remove Image</title>
       <link rel="stylesheet" type="text/css" href="style.css">


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >

<!--#Include file="AdminEventGlobalVariables.asp"-->

<%
totalcount = Request.Form("totalcount")
dim filename (10000)
dim DownloadTitle(10000)
dim PageDownloadsID(1000)
dim DownloadOrder(10000)
rowcount = 1

EventID = request.querystring("EventID")
pagelayoutid = request.querystring("pagelayoutid")
Blocknum = request.querystring("Blocknum")
filenamex = request.querystring("filename")
response.Write("filenamex=" & filenamex)
while (cint(rowcount) < cint(totalcount + 1))
	filenamecount = "filename(" & rowcount & ")"	
	filename(rowcount)=Request.Form(filenamecount) 

DownloadTitlecount = "DownloadTitle(" & rowcount & ")"	
	DownloadTitle(rowcount)=Request.Form(DownloadTitlecount) 
	
	PageDownloadsIDcount = "PageDownloadsID(" & rowcount & ")"	
	PageDownloadsID(rowcount)=Request.Form(PageDownloadsIDcount) 
	
	DownloadOrdercount = "DownloadOrder(" & rowcount & ")"	
	DownloadOrder(rowcount)=Request.Form(DownloadOrdercount) 
	
	response.Write("DownloadOrder=" & DownloadOrder(rowcount))
	rowcount = rowcount +1
Wend

'rowcount = CInt
rowcount = 1
    str1 = DownloadTitle(rowcount)
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		DownloadTitle(rowcount)= Replace(str1,  str2, "''")
	End If  

Response.write("DownloadTitle=" & DownloadTitle(rowcount) )
'Response.write(CaptionName)
 rowcount =1

while (cint(rowcount) < cint(totalcount + 1))
Query =  " UPDATE EventPageLayoutDownloads Set DownloadTitle = '" &  DownloadTitle(rowcount) & "', " 
Query =  Query & " DownloadOrder = '" &  DownloadOrder(rowcount) & "'" 
Query =  Query & " where PageDownloadsID = " &  PageDownloadsID(rowcount) & "" 
	
	

response.write(Query)	

Conn.Execute(Query) 

	  
rowcount = rowcount +1
Wend

Conn.Close
Set Conn = Nothing 
 Response.Redirect("FormsAdmin.asp?EventID=" & EventID)
'Response.write("filename =" & filename)
%>

	
 </Body>
</HTML>
