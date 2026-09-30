<html>
<head>
<!--#Include virtual="GlobalVariablesEvent.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"-->
<!--#Include file="EventHeader.asp"-->



<% 
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Dinner' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write("sql = " & sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if Not rs.eof then 	
	'ServiceTypeLookupID = rs("ServiceTypeLookupID")
	'ServicesID = rs("ServicesID")
	'ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	'ServiceEndDateDay  = rs("ServiceEndDateDay")
	'ServiceEndDateYear  = rs("ServiceEndDateYear")
	VegitarianOption = rs("VegitarianOption")
	Title = rs("Title")
	Price= rs("Price")
	'response.write("Price = " & price & "<br>")

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	Description =  rs("Description")

	str1 = Description
	str2 = "</br>"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1, str2 , vbCrLf)
	End If  

	str1 = Description
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1,  str2, " ")
	End If 
	
	str1 = Description
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1,  str2, "'")
	End If 
	
	
	str1 = Title
	str2 = "</br>"
	If InStr(str1,str2) > 0 Then
		Title= Replace(str1, str2 , vbCrLf)
	End If  

	str1 = Title
	str2 = "&nbsp;"
	If InStr(str1,str2) > 0 Then
		Title= Replace(str1,  str2, " ")
	End If 
	
	str1 = Title
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		Title= Replace(str1,  str2, "'")
	End If 


if len(Title) > 1 then
	else
	  Title = "Dinner"
	end if

%>
<br>
<table border = "0" cellpadding=0 cellspacing=0 width = "<%=textwidth  %>" align = "center">
	<tr>
    	<td class = "body"  colspan = "2" ><b><h2><%=Title%></H2></b></td>
	</tr>	
	<tr>
		<td height = "1" bgcolor = "black" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
	<tr>
		<td height = "5" colspan = "2"><img src = "images/px.gif" width = "1" height = "1"><br><br></td>
	</tr>
</table>

	<table border = "0"    cellpadding=0 cellspacing=0 width = "<%=textwidth  %>" align = "Center" >	
	<% if Price > 0 then %>
		<tr>
			<td class = "body" align="Left" width="300"><b> Price: </b> $ <%=formatcurrency(Price, 2)%> per ticket</td>
		</tr>
		<% end if %>
				<% if DinnerTime > 0 then %>
		<tr> 
			<td class = "body" align="Left" width="300"><blockquote><b> Time: </b><%=DinnerTime%></blockquote></td>
	    </tr>
	    	<tr>
	    	<% end if %>	
			<td class = "body" colspan="1" align="left" width="<%=textwidth  %>" ><br /><%=Description%><br></td>
		</tr>
	   </table>
<% 
end if
rs.close
%>







<!--#Include file="Footer.asp"-->

</Body>
</html>
