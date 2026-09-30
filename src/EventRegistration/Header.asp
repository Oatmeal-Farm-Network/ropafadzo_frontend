

<SCRIPT Language=VBScript RUNAT=SERVER>
Function getFileName()
  Dim lsPath, arPath

  ' Obtain the virtual file path
  lsPath = Request.ServerVariables("SCRIPT_NAME")

  ' Split the path along the /s. This creates an
  ' one-dimensional array
  arPath = Split(lsPath, "/")

  ' The last item in the array contains the file name
  GetFileName =arPath(UBound(arPath,1))
End Function
</SCRIPT>


<SCRIPT Language=VBScript RUNAT=SERVER>
Function getFilePath()
  Dim lsPath, arPath

  ' Obtain the virtual file path. The SCRIPT_NAME
  ' item in the ServerVariables collection in the
  ' Request object has the complete virtual file path
  lsPath = Request.ServerVariables("SCRIPT_NAME")
    
  ' Split the path along the /s. This creates an
  ' This creates an one-dimensional array 
  arPath = Split(lsPath, "/")

  ' Set the last item in the array to blank string
  ' (The last item actually is the file name)
  arPath(UBound(arPath,1)) = ""

  ' Join the items in the array. This will
  ' give you the virtual path of the file
  GetFilePath = Join(arPath, "/")
End Function
</SCRIPT>


<% FileName = GetFileName %>
<% spacing = screenwidth / 190 
if screenwidth < 780 then
spacing = 0
end if
%>
<br>
<table  width="0" border="<%=PageBorder%>" bordercolor="white" cellpadding=0 cellspacing=0  align = "center" bgcolor = "white" align="center" width = "<%=screenwidth %>"><tr>
		<td align="center" valign="top" width = "<%=screenwidth %>">
		<table width="<%=screenwidth%>" border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
		  <tr>
		    <td colspan = "2" align = "center"  height = "130" valign = "top">
		     <center><img src = "/Uploads/HeaderBackground.jpg" width = "329" height = "129" border= "0"></center>
			<a href = 'RegistrySearch.asp' class= "menu" >&nbsp;Register for an Event</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">
				

<a href = 'RegCreateType.asp' class= "menu" >&nbsp;Create an Event</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">

	
<% if Session("LoggedIn") = "True" then %>
<a href = 'regHome.asp' class= "menu" >&nbsp;Manage Your Events</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">
<% else %>			
<a href = 'regLogin.asp' class= "menu" >&nbsp;Manage Your Event</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">
<% End If %>

<a href = 'RegCreateType.asp' class= "menu" >&nbsp;Rates</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">
		
<a href = 'AboutUs.asp' class= "menu" >&nbsp;About Us</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">
				
<a href = 'ContactUs.asp' class= "menu" >&nbsp;Contact Us</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">			
<% showlinks = false
if showlinke = true then %>
<a href = 'Links.asp' class= "menu" >&nbsp;Links</a>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">		
<% end if %>
	
		    <% if len(Session("PeopleID")) > 0 then %>
			    <a href = "Logout.asp?" class = "menu">Sign Out</a>
			    <img src = "images/px.gif" width = "<%=spacing%>" height = "1">
			    <a href = "AccountContactsEdit.asp?CurrentpeopleID=<%=Session("PeopleID") %>" class = "menu">Your Account</a> 
			<% else %>
			 <a href = "regcreateSignIn.asp?ReturnFileName=<%=Filename %>&ReturnEventID=<%=EventID%>" class = "menu">Sign In</a> 
			  <img src = "images/px.gif" width = "<%=spacing%>" height = "1">
			   <a href = "SetupAccount.asp?ReturnFileName=Default.asp&ReturnEventID=<%=EventID%>" class = "menu">Join AE</a> 
			<% end if %>
<img src = "images/px.gif" width = "<%=spacing%>" height = "1">

		   <a href = "Default.asp" class = "menu">Home</a> 

		    </td>
		  </tr>
		  	<tr>
				<td class = "body" align ="left" bgcolor = "#abacab" height = "1"></td></tr><tr><td colspan = "2" bgcolor = "white"  valign = "top" height = "400">


