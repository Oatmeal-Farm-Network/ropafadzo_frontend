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

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>

</head>


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >
<!'--#Include file="AdminEventGlobalVariables.asp"--> 
<!'--#Include virtual="Header.asp"--> 

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<!--#Include file="OverviewHeader.asp"-->

<% 
Header = Request.Querystring("Header")
PageName=Request.Querystring("PageName" ) 
Filename = "PageData2.asp?PageName=" & PageName & "&Header=" & Header


If Len(PageName) = 0 then
	PageName=Request.Form("PageName" ) 
End If
session("PageName") = PageName

if len(Header) < 2 then
  Header = PageName
end if

HeaderFound=False
if Header = "Halter" then
  HeaderFound=True
%>
<!'--#Include File="HalterHeader.asp"--> 
<% end if 
if Header = "Other" then
  HeaderFound=True
%>
<!--#Include File="OtherHeader.asp"--> 
<% end if 

if Header = "Silent Auction" then
  HeaderFound=True
%>
<!--#Include File="SilentAuctionHeader.asp"--> 
<% end if 

if Header = "Stud Auction" then
  HeaderFound=True
%>
<!--#Include file="StudAuctionHeader.asp"--> 
<% end if 

if HeaderFound=False then %>
<!--#Include File ="OverviewHeader.asp"--> 

<%
end if
CustID = session("CustID")

Dim PageLayout2IDArray(1000)
Dim BlockNum
Dim PageHeadingArray(1000)
Dim EditImageArray(1000)
Dim PageTextArray(1000)
Dim ImageArray(1000)
Dim ImageCaptionArray(1000)
Dim ImageOrientationArray(1000)
Dim ImageLinkArray(1000)
Dim UploadTextArray(1000)
Dim UploadArray(10000)
Dim PageDownloadsIDArray(10000)


sql = "select EventPageLayout.PageName, EventPageLayout2.* from EventPageLayout, EventPageLayout2 where EventPagelayout.PageLayoutID  = EventPageLayout2.PageLayoutID  and EventPageLayout.PageName = '" & Pagename & "' and EventPageLayout.EventID = " & EventID & " order by BlockNum"
	
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3  
while not rs.eof


PageLayoutID = rs("PageLayoutID")
	BlockNum = rs("BlockNum")
	

	
	PageLayout2IDArray(BlockNum) = rs("PageLayout2ID")
	PageHeadingArray(BlockNum) = rs("PageHeading")
		
	str1 = PageHeadingArray(BlockNum)
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		PageHeadingArray(BlockNum)= Replace(str1,  str2, " ")
	End If 

	str1 = PageHeadingArray(BlockNum)
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		PageHeadingArray(BlockNum) = replace(str1,  str2, "'")
	End If 





	EditImageArray(BlockNum) = rs("EditImage")
	PageHeadingArray(BlockNum) = rs("PageHeading")
	PageTextArray(BlockNum) = rs("PageText")
	
	
	str1 = PageTextArray(BlockNum)
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageTextArray(BlockNum)= Replace(str1,  str2, " ")
End If 

str1 = PageTextArray(BlockNum)
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageTextArray(BlockNum)= Replace(str1,  str2, "'")
End If 


str1 = PageTextArray(BlockNum)
str2 = "<br>"
If InStr(str1,str2) > 0 Then
	PageTextArray(BlockNum)= Replace(str1, str2 , vbCrLf)
End If  

	
	
	ImageArray(BlockNum) = rs("Image")
	ImageCaptionArray(BlockNum) = rs("ImageCaption")
	
	if ImageCaptionArray(BlockNum) = "0" then
   		ImageCaptionArray(BlockNum)= ""
	end if

	str1 =  ImageCaptionArray(BlockNum)
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		 ImageCaptionArray(BlockNum)= Replace(str1,  str2, " ")
	End If 

	str1 = ImageCaptionArray(BlockNum)
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		ImageCaptionArray(BlockNum)= Replace(str1,  str2, "'")
	End If
	
str1 =  Trim(ImageCaptionArray(BlockNum))
	str2 = "0"
	If InStr(str1,str2) > 0 Then
		 ImageCaptionArray(BlockNum)= Replace(str1,  str2, "")
	End If 
 

	ImageOrientationArray(BlockNum) = rs("ImageOrientation")
	ImageLinkArray(BlockNum) = rs("ImageLink")
	
	str1 =  Trim(ImageLinkArray(BlockNum))
	str2 = "0"
	If InStr(str1,str2) > 0 Then
		 ImageLinkArray(BlockNum)= Replace(str1,  str2, "")
	End If 



	UploadTextArray(BlockNum) = rs("UploadText")
	UploadArray(BlockNum) = rs("Upload")




rs.movenext
wend

LastBlockNum = BlockNum


if len(PageTextArray(LastBlockNum)) > 2 or len(PageHeadingArray(LastBlockNum)) > 2 or  len(UploadTextArray(LastBlockNum)) > 2 or  len(UploadArray(LastBlockNum)) > 2 or len(ImageArray(LastBlockNum)) > 2 or len(ImageCaptionArray(LastBlockNum)) > 2 then
LastBlockNum = LastBlockNum + 1
Query =  "INSERT INTO EventPageLayout2 ( BlockNum, PageLayoutID)" 
		Query =  Query & " Values (" &  LastBlockNum & "," 
		Query =  Query & " " &  PageLayoutID & ")"
		


Conn.Execute(Query) 


'response.redirect("PageData2.asp?PageName=" & PageName )


end if 


  %>

<%  PageTitleText = Pagename & " Page Content"%>
<a name="Top"></a>
<table border = "0" width = "<%=screenwidth %>">
<tr>
<td align = "center" valign = "top">
	
	
<!--#Include File ="PagedataeditInclude.asp"--> 
</td>
</tr>
</table>

<br><br><br>
<div align = "center"><a href = "#Top" class ="body">Top of the page.</a></div>


<!-- #include virtual="Footer.asp" -->
 </Body>
</HTML>
