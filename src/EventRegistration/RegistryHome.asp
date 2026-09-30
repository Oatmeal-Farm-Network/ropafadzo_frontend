
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<META name="description" content="<%= SEODescription %> ">
<META name="keywords" content="<%= SEOKeyword1 %>, 
<%=SEOKeyword2%>, 
<%=SEOKeyword3 %>,
<%=SEOKeyword4 %>, 
<%=SEOKeyword5 %>, 
<%=SEOKeyword6 %>,  
<%=SEOKeyword7 %>, 
<%=SEOKeyword8 %>, 
<%=SEOKeyword9 %>, 
<%=SEOKeyword10 %>, 
<%=SEOKeyword11 %>, 
 <%=SEOKeyword12 %>, 
 <%=SEOKeyword13 %>, 
 <%=SEOKeyword14 %>, 
 <%=SEOKeyword15 %>, 
 <%=SEOKeyword16 %>, 
 <%=SEOKeyword17 %>, 
 <%=SEOKeyword18 %>, 
 <%=SEOKeyword19 %>, 
 <%=SEOKeyword20 %> ">


<meta name="author" content="The Andresen Group">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include file="RegHeader.asp"-->
	
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   height = "250" width = " 780" >
	<tr>
	<td >
    <Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "100%">
			<tr>
				<td class = "body" align ="left">
					<h1><%=PageTitle %></h1>
				</td>
			</tr>
		<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
		
			<tr>
			   <td class = "body">
										<% If Len(Image1) > 1 Then %> 
									<img src = "<%=Image1 %>"  valign = "top" width = "250" align = "right" border = "1"><br>
							<% end if %>
							<%=PageText %><br><br>
 <form action= 'RegistrySearch.asp' method = "post">							
<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "left" valign = "top" width = "497" height = "200" bgcolor = "white">
<tr><td class = "body" width = "165" valign = "top">


<table width = "165" height = "200" border = "0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"    align = "center"><tr><td bgcolor = "brown" align = "center" class = "body"><font color = "linen"><b>Give a Gift</b></font></td><tr>
<tr><td class = "body">To search for a gift registry, enter the registrant's, or co-registrant's, name:
</td></tr>
		<tr>
			<td class = "body" align = "left">		
					<b>First Name</b><br>
					<input name="FirstName" Value =""  size = "25" maxlength = "61">
			</td>
		</tr>
		<tr>
			<td class = "body" align = "left">		
					<b>Last Name</b><br>
					<input name="LastName" Value =""  size = "25" maxlength = "71">
			</td>
					</tr>
<tr><td height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td bgcolor = "brown" width = "165" align = "center" height = "23"><input type=submit class = "regsubmit" value="Search" width = "165" ></td></tr></table>


								
</form>
</td>
<td class = "body" bgcolor = "black" width = "1"><img src = "images/px.gif" height = "0" width = "0"></td>
<td class = "body" width = "165" valign = "top" align = "center"> <form action= 'regcreateSignIn.asp' method = "post">
<table width = "165" height = "200" border = "0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"    align = "center"><tr><td bgcolor = "brown" align = "center" class = "body"><font color = "linen"><b>Create My Registry</b></font></td><tr>
<tr><td class = "body">Get your registry going.
It's fun and easy.
</td></tr>
<tr><td height = "112"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td bgcolor = "brown" width = "165" align = "center" height = "23"><input type=submit class = "regsubmit" value="Start Here" width = "165" ></td></tr></table>
</form>
</td>
<td class = "body" bgcolor = "black"><img src = "images/px.gif" height = "0" width = "0"></td>
<td class = "body" width = "165" valign = "top"><form action= 'regLogin.asp' method = "post">
<table width = "165" height = "200" border = "0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"    align = "center"><tr><td bgcolor = "brown" align = "center" class = "body"><font color = "linen"><b>Manage My Registry</b></font></td><tr>
<tr><td class = "body">Add, edit, view and have 
fun with your registry.
</td></tr>
<tr><td height = "112"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td bgcolor = "brown" width = "165" align = "center" height = "23"><input type=submit class = "regsubmit" value="Sign In" width = "165" ></td></tr></table>

</td></tr></table>
	
</form>	

</td>
</tr>	
	
	</table>
<!--#Include file="Footer.asp"-->



</body>
</html>