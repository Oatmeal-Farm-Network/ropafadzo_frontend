<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Forms</title>
<meta http-equiv="Content-Language" content="en-us">
 
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Forms" %>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"--> 

<%
EventID = request.querystring("EventID")

If Request.Querystring("UpdateForms" ) = "True" Then
  PageLayoutID= Request.Form("PageLayoutID") 
PageText= Request.Form("Description") 
PageLayout2ID= Request.Form("PageLayout2ID") 


Query =  " UPDATE EventPageLayout2 Set PageText = '" &  PageText & "' "
Query =  Query & " where PageLayoutID = " & PageLayoutID & " and EventID = " & EventID & ";" 

'response.write("Query = " & Query)
Conn.Execute(Query) 
end if


%>
<!'--#Include file="FormsHeader.asp"--> 
<% PageTitleText = "Forms Overview"  %>
<% Current = "Forms" %>
<!--#Include file="970Top.asp"-->

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "950" align = "center">
	<tr>
	   
 <td valign = "top">  
 

<% 

sql = "select * from EventPageLayout, EventPageLayout2  where EventPageLayout.PageLayoutID = EventPageLayout2.PageLayoutID and PageName = 'Forms' and  EventPageLayout.EventID =  " & EventID & " Order by  EventPageLayout.PageLayoutID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	Description = rs("PageText")
	PageLayoutID = rs("PageLayoutID")
	PageLayout2ID = rs("PageLayout2ID")
	Upload =  rs("Upload")
	'response.write("ipload=" & Upload )
str1 = PageText
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1, str2 , vbCrLf)
End If  


str1 = PageText
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1,  str2, " ")
End If 

str1 = PageText
str2 = "''"
If InStr(str1,str2) > 0 Then
	PageText= Replace(str1,  str2, "'")
End If 

	
End If 


%>




<form  name=Formsform method="post" action="FormsAdmin.asp?EventID=<%=EventID%>&UpdateForms=True">
 <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "950" align = "center" >
 <tbody>
	<tr>
<td class= "body2"  width = "500" valign = "top"> 
<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
<table border = "0"  cellpadding=0 cellspacing=0 width = "500" align = "center" >
	<tr>
	   <td  valign = "top" ><br><b>Forms Description</b></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"></td></tr>
	<tr><td class = "body2"  height = "1">Include a bit of text about what the 
		forms are for and why they are handy.</td></tr>
<tr><td>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script> 
<br>
	  <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= Description%></textarea> </td></tr>
	 <tr><td align = "center">
	<input type = "hidden"  name ="PageLayoutID"  value ="<%=PageLayoutID%>">
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<input type="submit"  value="Submit" class = "Regsubmit2" ><br>
	</form>
	</td>
	</tr>
</table>

	</td>
    </tr><tr>
	<td  valign = "top" class = "body">
	<table width = "<%=screenwidth %>" cellpadding = "0" cellspacing = "0">
	<tr>
	   <td  valign = "top" ><br><b>Upload Forms</b></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"></td></tr>
	<tr><td class = "body2" height = "1">Upload forms below <b>(PDF, DOC, Or EXL 
		formats only)</b>:<br><br></td></tr>
	<tr><td class = "body">




<table border = "0" cellspacing="0" cellpadding = "0" align = "left" width = "920"><tr><td class = "roundedtop" align = "left">
	<h2>Downloadable Files</h2></td></tr>
        <tr><td class = "roundedBottom" align = "left" >
<br />
				</h3>Upload forms and documents</h3> (PDF, Word, or Excel only. Max size 500KB) <br>
				 <form name="frmSend" method="POST" enctype="multipart/form-data" action="EventUploadaDownload.asp?EventID=<%=eventid %>" >
								
								<input name="attach1" type="file" size=35 class = "regsubmit2">
								<input  type=submit value="Upload" class = "regsubmit2">
								
							</form>
				
<% 
sqld = "select count(*) as docrecordcount from EventPageLayoutDownloads where EventID = " & EventID & " order by DownloadOrder"
Set rsd = Server.CreateObject("ADODB.Recordset")
rsd.Open sqld, conn, 3, 3  
if not rsd.eof then
docrecordcount = cint(rsd("docrecordcount"))
end if
rsd.close


 sqld = "select * from EventPageLayoutDownloads where EventID = " & EventID & " order by DownloadOrder"
'response.write("sqld=" & sqld )
Set rsd = Server.CreateObject("ADODB.Recordset")
rsd.Open sqld, conn, 3, 3  
if not rsd.eof then %>
 
<table border = "0">
<tr>
	<td width = "400" class = "body" align = "center">
			<b>File Name</b>
	</td>
	<td width = "400" class = "body" align = "center">
	 <center><b>Link Title</b></center>
	</td>
	<td width = "35" class = "body" align = "center">
	 <center><b>Order</b></center>
	</td>
	<td width = "85" class = "body" align = "left">
						
				</td>
				</tr>
				
<form   action="AdminUploadLinkTitleUpdate.asp?PageDownloadsID=<%= PageDownloadsID%>&EventID=<%=EventID%>" method="POST" >
 <% 
 count = 0
 response.write("docrecordcount=" & docrecordcount )

 while not rsd.eof 
 count = count+1
DownloadFile=rsd("DownloadFile")
 DownloadOrder=rsd("DownloadOrder")
 DownloadTitle=rsd("DownloadTitle")
 PageDownloadsID=rsd("PageDownloadsID")
 %>
 	<tr>
				<td  class = "body" align = "left" valign = "top">
				<% if len(DownloadFile)> 1 then %>
						<b><%=right(DownloadFile, len(DownloadFile) - 9)%></b><br>
				<% end if %>
				</td>
				<td class = "body" align = "left" valign = "top">
				

	<input name="DownloadTitle(<%=count %>)" type="text" size=65 value = "<%= DownloadTitle%>">
	<input type = "hidden" name="filename(<%=count %>)" value= "<%=filename%>" >


							
</td>
<td>

	<select size="1" name="DownloadOrder(<%=count %>)">
	<option value="<%=DownloadOrder%>" selected><%=DownloadOrder%></option>
	<% ordercounter = 1
	 while ordercounter < (docrecordcount + 1) %>									
	   		<option  value="<%=ordercounter%>"><%=ordercounter%></option>
		<% ordercounter = ordercounter + 1
		wend %>
    </select>
										
</td>
<td class = "body" align = "left" >
	<input type = "hidden" name="PageDownloadsID(<%=count %>)" value= "<%=PageDownloadsID %>" >
			<% if len(DownloadFile)> 1 then %>

<a href= 'RemoveUpload.asp?PageDownloadsID=<%=PageDownloadsID %>&EventID=<%=EventID%>' class = "body"><b>Remove File</b></a>

	<% end if %>
				</td>
				</tr>
				
	
<%
   rsd.movenext
   wend %>
   <tr>
   <td colspan = "4" align = "center"><input type = "hidden" name="totalcount" value= "<%=count%>" >
   				<input  type=submit value="Submit" class = "regsubmit2">
   </td>
   </tr>
   </table>
   					</form>		

 <% end if 
 rsd.close
 %>
				</td>
				</tr>
	 </table>	
			
				
					
						
				</td>
				</tr>
	 </table>
</td>
				</tr>
	 </table>
</td>
				</tr>
	 </table>








		</td>
	</tr>
</table>

	</td>
	</tr>
</table>

	</td>
	</tr>
</table>


		<!--#Include file="Footer.asp"-->
		
		</Body>
		</html>