<!doctype html>
<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">
<script>
    function printFrame() {
        frames["ifrm"].focus();
        frames["ifrm"].print();
    }
 </script>


    


<%
EventTotalIncome = 0
 Set rs = Server.CreateObject("ADODB.Recordset") 
  Set rs2 = Server.CreateObject("ADODB.Recordset") 
Show=request.form("Show")
if len(Show) < 1 then
  Show = request.QueryString("Show")
end if
 					
If len(Show) < 1 then
  CurrentShow = ""
else
	CurrentShow = Show
End if	
					


			
Sort=request.form("Sort") 
If Len(Sort) < 4 Then
	Sort = "Prodname"
End if
%>


 <% 
DisplayAddresses = False
ShowAddresses = request.Form("ShowAddresses")
FirstTime = request.Form("FirstTime")
if len(FirstTime)  = 0 then
	ShowAddresses = "ShowAddresses"
 end if 
	     	  
ShowRegistrations = request.Form("ShowRegistrations")
if len(FirstTime)  = 0 then
	ShowRegistrations = "All"
end if 

OrderRegistrations = request.Form("OrderRegistrations")
if len(FirstTime)  = 0 then
	OrderRegistrations = "date"
end if 	
	
%>
</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<!--#Include file="RegistrationsHeader.asp"--> 

<a name="Top"></a>
<% PageTitleText = "List of Registrations"  %>
<!--#Include file="970Top.asp"-->

			 
<br>
<table border = "0" width = "960">
<tr>
<td align = "center" valign = "top">
<table   border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = "center" width = "950">
	<tr>

		<td class = "body" align = "right"><form action= "ReportRegistrationsListPrintable.asp" method = "post">
<table   border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 align = "right" width = "800">
	<tr>	<td class = "body"><h3>Report Criteria:</h3></td>
	<td class = "body">Show:</td>
<td class = "body" align = "right">

<select size="1" name="ShowRegistrations" width="125" style="width: 125px">
<% if len(ShowRegistrations) > 1 then %>
		<option  value= "<%=ShowRegistrations %>" selected><%=ShowRegistrations %></option>
		<option  value= "Any" >All Registrations</option>
<% else %>
		<option  value= "Any" selected>All Registrations</option>
<% end if %>
					<option  value="Classes">Classes</option>
				     <option  value="Vendors">Vendors</option>
				     <option  value="Sponsors">Sponsors</option>
			 </select>

        </td>
        <td class = "body">Order By:</td>
<td class = "body" align = "right">

<select size="1" name="OrderRegistrations" width="125" style="width: 125px">
<% if len(OrderRegistrations) > 1 then %>
		<option  value= "<%=OrderRegistrations %>" selected><%=OrderRegistrations %></option>
		<option  value= "Date" >Date</option>
<% else %>
		<option  value= "Date" selected>Registration Date</option>
<% end if %>
<option  value="Name">Registrant Last Name</option>
<option  value="BusinessName">Business Name</option>
</select>

        </td>
		<td class = "body" align = "right"><br />
			<div align = "right">
			
			
			<% if ShowAddresses  = "ShowAddresses" then 
			       DisplayAddresses = True %>
 	 	    <input type="checkbox" name="ShowAddresses" value="ShowAddresses" checked  >Show Addresses
 	 	<% else %>
 	 	    <input type="checkbox" name="ShowAddresses" value="ShowAddresses" >Show Addresses
 	 	<% end if %> 	
 	 	<input type="hidden" name="FirstTime" value="False" >
 <input type=submit value="Submit"  class = "regsubmit2" >
		  
		</div>
		</td>
		<td width = "90"></td>
	</tr>
</table></form>
</td>

<td class = "body">
<button onclick="printFrame()" border = "0" Class = "button"><img src= "images/printer.jpg" alt = "Print Report" border = "0"  /></button>
</td>
</tr>
<tr>
<td colspan = "2">
<iframe id="ifrm" name="ifrm" src="ReportRegistrationsListPrintableiFrame.asp?DisplayAddresses=<%=DisplayAddresses%>&ShowRegistrations=<%= ShowRegistrations%>&OrderRegistrations=<%=OrderRegistrations %> " width = "800" height = "900"></iframe>
</td></tr></table>


<br>
<!--#Include file="970Bottom.asp"--><br> <br>
<!--#Include file="Footer.asp"--> </Body>
</HTML>